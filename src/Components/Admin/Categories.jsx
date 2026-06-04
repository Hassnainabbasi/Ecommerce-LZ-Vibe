import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { Check, FolderKanban, Pencil, Tags, Trash2, X } from 'lucide-react';

function normalizeCategoryKey(name) {
  return String(name || '').trim().toLowerCase();
}

/** Reads one category label from an Excel/CSV row (header row supported). */
function rowToCategoryName(row) {
  if (!row || typeof row !== 'object') return '';
  const normKey = (k) =>
    String(k)
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/_/g, '');
  const preferred = ['categoryname', 'name', 'category', 'title', 'cat'];
  for (const want of preferred) {
    for (const [k, v] of Object.entries(row)) {
      if (normKey(k) === want) {
        const s = v != null ? String(v).trim() : '';
        if (s) return s;
      }
    }
  }
  for (const v of Object.values(row)) {
    if (v == null || v === '') continue;
    const s = String(v).trim();
    if (s) return s;
  }
  return '';
}

const BULK_CATEGORY_CHUNK = 500;

/** Optional fields for `/api/categories/bulk-import` from a sheet row. */
function rowToCategoryBulkItem(row) {
  const name = rowToCategoryName(row);
  if (!name) return null;
  const item = { name };
  const nk = (k) =>
    String(k)
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/_/g, '');
  for (const [k, v] of Object.entries(row)) {
    const key = nk(k);
    if (key === 'description' || key === 'desc') {
      const s = v != null ? String(v).trim() : '';
      if (s) item.description = s;
    } else if (key === 'image' || key === 'imageurl') {
      const s = v != null ? String(v).trim() : '';
      if (s) item.image = s;
    } else if (key === 'isactive' || key === 'active') {
      const s = String(v ?? '').trim().toLowerCase();
      if (s) item.isActive = !['false', '0', 'no', 'n'].includes(s);
    }
  }
  return item;
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/categories`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      } else {
        // If API doesn't exist, get categories from products
        const productsRes = await fetch(`${API_BASE}/products/getAllProducts`, {
          credentials: "include",
        });
        const productsData = await productsRes.json();
        if (productsData.success) {
          const uniqueCategories = [...new Set(productsData.products.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories.map(cat => ({ name: cat })));
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Category added successfully!");
        setNewCategory('');
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to add category");
      }
    } catch (err) {
      console.error("Failed to add category", err);
      toast.error("Failed to add category");
    }
  };

  const postCategoriesBulk = async (categoryObjects) => {
    const res = await fetch(`${API_BASE}/api/categories/bulk-import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ categories: categoryObjects }),
    });
    let data = {};
    try {
      data = await res.json();
    } catch {
      /* non-JSON */
    }
    return {
      ok: (res.ok || res.status === 201) && data.success,
      status: res.status,
      data,
    };
  };

  const downloadCategoriesTemplate = () => {
    const header = ["Category Name"];
    const example = ["Example: Protein"];
    const ws = XLSX.utils.aoa_to_sheet([header, example, [""]]);
    ws["!cols"] = [{ wch: 28 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Categories");
    XLSX.writeFile(wb, "categories-import-template.xlsx");
    toast.success("Template downloaded. Row 1 = header, row 2 = sample (replace with your names).");
  };

  const handleImportCategoriesFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImporting(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) {
        toast.error("The file has no sheets.");
        return;
      }
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
        defval: "",
        raw: false,
      });
      const itemsByKey = new Map();
      for (const row of rows) {
        const item = rowToCategoryBulkItem(row);
        if (!item) continue;
        const key = normalizeCategoryKey(item.name);
        if (!key) continue;
        if (!itemsByKey.has(key)) itemsByKey.set(key, item);
      }
      const bulkPayload = [...itemsByKey.values()];
      if (bulkPayload.length === 0) {
        toast.error("No category names found. Use the template: column header Category Name, then one name per row.");
        return;
      }

      let totalInserted = 0;
      let totalSkipped = 0;
      let totalErrors = 0;

      for (let offset = 0; offset < bulkPayload.length; offset += BULK_CATEGORY_CHUNK) {
        const chunk = bulkPayload.slice(offset, offset + BULK_CATEGORY_CHUNK);
        const { ok, status, data } = await postCategoriesBulk(chunk);

        if (status === 404 || status === 405) {
          toast.error(
            "Bulk import endpoint not available on this server. Enable POST api/categories/bulk-import — single-row create is not used for Excel import."
          );
          return;
        }

        if (ok) {
          if (data.summary) {
            totalInserted += data.summary.inserted ?? 0;
            totalSkipped += data.summary.skipped ?? 0;
            totalErrors += data.summary.errors ?? 0;
          } else if (Array.isArray(data.inserted)) {
            totalInserted += data.inserted.length;
          }
          if (Array.isArray(data.errors) && data.errors.length) {
            console.warn("Category bulk import row errors:", data.errors);
          }
          if (Array.isArray(data.skipped) && data.skipped.length) {
            console.info("Category bulk import skipped:", data.skipped);
          }
        } else {
          toast.error(data.message || `Bulk import failed (${status || "error"})`);
          await fetchCategories();
          return;
        }
      }

      await fetchCategories();

      const msg =
        totalInserted || totalSkipped || totalErrors
          ? `Bulk import: ${totalInserted} inserted, ${totalSkipped} skipped, ${totalErrors} errors.`
          : "Bulk import completed.";
      if (totalErrors && !totalInserted) toast.error(msg);
      else if (totalErrors) toast.success(msg);
      else toast.success(msg);
    } catch (err) {
      console.error("Import categories failed", err);
      toast.error("Could not read the file. Use .xlsx, .xls, or .csv from the template.");
    } finally {
      setImporting(false);
    }
  };

  const handleEditCategory = async (categoryId, newName) => {
    if (!newName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newName.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Category updated successfully!");
        setEditingCategory(null);
        setEditName('');
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (err) {
      console.error("Failed to update category", err);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/categories/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Category deleted successfully!");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Failed to delete category", err);
      toast.error("Failed to delete category");
    }
  };

  if (loading) {
    return <div className="text-gray-800 p-4">Loading categories...</div>;
  }

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
        Manage Categories
      </h1>

      {/* Add Category Form */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Category</h2>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={downloadCategoriesTemplate}
              disabled={importing}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 font-semibold text-sm transition-colors disabled:opacity-50"
            >
              Download Excel template
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {importing ? "Importing…" : "Import from Excel"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              className="hidden"
              onChange={handleImportCategoriesFile}
            />
          </div>
        </div>
     
        <form onSubmit={handleAddCategory} className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={importing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 sm:shrink-0"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Categories List */}
      <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-950/5">
        <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-50/80 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
                <FolderKanban className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  All categories
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Names used across products and navigation. Edit or remove as needed.
                </p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-medium tabular-nums text-slate-600 shadow-sm">
              {categories.length} {categories.length === 1 ? 'category' : 'categories'}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {categories.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((category, index) => {
                const categoryId = category._id || category.id || index;
                const categoryName = category.name || category;
                const isEditing = editingCategory === categoryId;
                const displayName =
                  typeof categoryName === 'string'
                    ? categoryName
                    : String(categoryName ?? '');

                return (
                  <li key={categoryId}>
                    <div
                      className={[
                        'group relative flex flex-col rounded-xl border bg-white p-4 transition-all duration-200',
                        isEditing
                          ? 'border-blue-200/90 shadow-md ring-2 ring-blue-100/80'
                          : 'border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-md',
                      ].join(' ')}
                    >
                      {isEditing ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <label className="sr-only" htmlFor={`edit-cat-${categoryId}`}>
                            Edit category name
                          </label>
                          <input
                            id={`edit-cat-${categoryId}`}
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="min-h-[44px] w-full flex-1 rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-inner outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleEditCategory(categoryId, editName);
                              }
                              if (e.key === 'Escape') {
                                setEditingCategory(null);
                                setEditName('');
                              }
                            }}
                          />
                          <div className="flex shrink-0 gap-2 sm:justify-end">
                            <button
                              type="button"
                              onClick={() => handleEditCategory(categoryId, editName)}
                              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 sm:flex-initial sm:px-3.5"
                              aria-label="Save changes"
                            >
                              <Check className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategory(null);
                                setEditName('');
                              }}
                              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:flex-initial sm:px-3.5"
                              aria-label="Cancel editing"
                            >
                              <X className="h-4 w-4" aria-hidden />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
                            <Tags className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                          </span>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <p className="truncate text-[15px] font-semibold leading-snug text-slate-900">
                              {displayName}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">Store category</p>
                          </div>
                          <div className="flex shrink-0 gap-1.5 pt-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategory(categoryId);
                                setEditName(displayName);
                              }}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(categoryId)}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-100 bg-red-50/80 px-2.5 text-xs font-medium text-red-700 shadow-sm transition-colors hover:border-red-200 hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-14 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm ring-1 ring-slate-100">
                <Tags className="h-7 w-7" strokeWidth={1.5} aria-hidden />
              </span>
              <p className="text-base font-medium text-slate-800">No categories yet</p>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
                Add a category above or import from Excel to organise your catalogue.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

