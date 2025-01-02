"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';

interface FormData {
  name: string;
  phone: string;
  email: string;
}

const phoneInputCustomStyles = `
  .PhoneInput {
    position: relative;
  }

  .PhoneInputInput {
    height: 2.75rem;
    width: 100%;
    background-color: rgb(39 39 42 / 0.5);
    border: 1px solid rgb(63 63 70 / 0.5);
    border-radius: 0.375rem;
    color: white;
    font-size: 0.875rem;
    padding-left: 4.5rem !important;
    padding-right: 0.75rem;
  }

  .PhoneInputCountry {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    z-index: 1;
    gap: 0.25rem;
    cursor: pointer;
    padding-right: 0.5rem;
    border-right: 1px solid rgb(63 63 70 / 0.5);
  }

  .PhoneInputCountryIcon {
    border-radius: 4px;
    overflow: hidden;
  }

  .PhoneInputCountryIcon img {
    border-radius: 4px;
    object-fit: cover;
  }

  .PhoneInputCountrySelectArrow {
    color: rgb(113 113 122);
    opacity: 0.8;
    margin-left: 2px;
  }

  .PhoneInputInput::placeholder {
    color: rgb(113 113 122);
  }

  .PhoneInputInput:focus {
    outline: none;
    border-color: rgb(34 197 94 / 0.5);
    box-shadow: 0 0 0 2px rgb(34 197 94 / 0.3);
  }

  .PhoneInputCountry:hover .PhoneInputCountrySelectArrow {
    color: white;
    opacity: 1;
  }

  .PhoneInputCountrySelect {
    background-color: rgb(39 39 42);
    color: white;
    border: 1px solid rgb(63 63 70 / 0.5);
  }

  .PhoneInputCountrySelect option {
    background-color: rgb(39 39 42);
    color: white;
    padding: 8px;
  }

  .PhoneInputCountrySelect option:hover {
    background-color: rgb(63 63 70);
  }
`;

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError("Please enter a valid e-mail");
      setLoading(false);
      return;
    }

    if (!formData.phone || formData.phone.length < 8) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      console.log("Response Text:", text);

      if (response.ok) {
        const data = JSON.parse(text);
        setSubmitted(true);
        setFormData({ name: "", phone: "", email: "" });
      } else {
        throw new Error("Form Submission Failed");
      }
    } catch (error: any) {
      console.error("Error during form submission:", error);
      setError(error.message || "There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    if (value && value.length > 12) {
      return;
    }
    setFormData(prev => ({ ...prev, phone: value || "" }));
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black">
      <style>{phoneInputCustomStyles}</style>
      <div className="w-full max-w-md px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl" />
          <div className="relative backdrop-blur-xl bg-zinc-900/40 rounded-2xl border border-zinc-800/50 p-6 sm:p-8">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-medium tracking-tight text-white">
                Contact Us Now
              </h2>
              <p className="text-sm text-zinc-400">
                Please fill out the information below.
              </p>
            </div>

            {submitted ? (
              <div className="mt-8 rounded-xl bg-green-500/10 p-4">
                <p className="text-sm text-center font-medium text-green-400">
                  Thank you for the form submission! We'll contact you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="space-y-3">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-11 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500 focus:border-green-500/50 focus:ring-green-500/30"
                  />
                  
                  <PhoneInput
                    defaultCountry="US"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    placeholder="Phone Number"
                    limitMaxLength={true}
                    countrySelectProps={{ 
                      title: 'Country',
                      className: 'text-white bg-zinc-800'
                    }}
                    international={false}
                  />
                  
                  <Input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-11 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500 focus:border-green-500/50 focus:ring-green-500/30"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400 text-center">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-[#208A2E] to-[#196E24] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Form</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
