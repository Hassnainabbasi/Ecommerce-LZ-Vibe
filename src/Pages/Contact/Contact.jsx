import FAQSection from "../../Components/According/FaqAcording";
import ContactForm from "../../Components/ContactForm/ContactForm";

function Contact() {
  return (
    <>
      <div className="text-center m-2 mb-10 ">
        <h4 className="text-4xl md:text-[48px] font-semibold leading-tight text-center max-w-xl m-auto text-slate-900 pt-6">
          Need help?
        </h4>
        <h4 className="p-5 text-xl font-medium text-slate-700">Reach us on WhatsApp</h4>
        <p className="p-3 text-lg text-slate-600">
          Message us during business hours: <span className="text-blue-600 font-medium">+92 300 0000000</span>
        </p>
        <h4 className="p-5 text-xl font-medium text-slate-700">Call us</h4>
        <p className="p-3 text-lg text-slate-600">
          Phone: <span className="text-blue-600 font-medium">+92 300 0000000</span>
        </p>
        <h4 className="p-5 text-xl font-medium text-slate-700">Email</h4>
        <p className="p-3 text-lg text-slate-600">
          <span className="text-blue-600 font-medium">support@example.com</span>
        </p>
        <h4 className="p-5 text-xl font-medium text-slate-700">Visit us</h4>
        <p className="p-3 text-lg text-slate-600">
          <span className="text-slate-700">Your store address, city</span>
        </p>
        <h4 className="p-5 text-xl font-medium text-slate-700">Follow us</h4>
        <p className="p-3 text-lg">
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Facebook</a>
        </p>
      </div>

      <div className="w-full flex flex-wrap justify-around">
        <div className="w-full md:w-[40%] h-fit m-5 p-5 rounded">
          <FAQSection />
        </div>
        <div className="w-full md:w-[50%] h-fit m-5">
          <ContactForm />
        </div>
      </div>
    </>
  );
}

export default Contact;
