import React, { useState } from "react";
import {
  Mail,
  Send,
  MessageSquare,
  Building2,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import CardTilt3D from "../../components/common/CardTilt3D";
import confetti from "canvas-confetti";

export default function ContactPage({ onGetStarted, onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "evaluation",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#22C55E", "#BEF264", "#10B981"],
    });
  };

  return (
    <div className="space-y-20 pb-24 text-charcoal-900">
      {/* 1. HERO HEADER */}
      <section className="pt-8 lg:pt-14 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>Connect With EcoTrace</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Let's Build a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
            Greener Future Together
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
          Have questions about our calculation engines, interested in bringing EcoTrace to your
          housing society, or evaluating for university examination? Reach out to our engineering team.
        </p>
      </section>

      {/* 2. FORM & INFO TWO-COLUMN GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <CardTilt3D
              maxTilt={3}
              className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-sm"
            >
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Message Dispatched Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting the EcoTrace research & development team. We will review
                    your inquiry and follow up within 24–48 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      Send Us an Inquiry
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      We welcome academic inquiries, society deployment requests, and bug reports.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Dr. Rajesh Kumar"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="rajesh@institution.edu"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nature of Inquiry
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) =>
                        setFormData({ ...formData, topic: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    >
                      <option value="evaluation">Academic Evaluation & Capstone Review</option>
                      <option value="society">Apartment Society / Community Pilot</option>
                      <option value="science">Scientific Baseline & Methodology Questions</option>
                      <option value="other">General Feedback & Bug Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Detailed Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Share your thoughts, suggestions, or inquiry details..."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </CardTilt3D>
          </div>

          {/* Right Column: Key Details & Repository Access (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <CardTilt3D
              maxTilt={4}
              className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm space-y-6"
            >
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                  Project Headquarters
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  EcoTrace Laboratory
                </h3>
              </div>

              <div className="space-y-4 text-xs text-slate-600 font-normal">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Location</span>
                    <span>Bangalore, Karnataka, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Direct Email</span>
                    <span>contact@ecotrace.demo</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Open Source Repository</span>
                    <a
                      href="https://github.com/Sohamsingh01/Eco-Trace.git"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline break-all"
                    >
                      github.com/Sohamsingh01/Eco-Trace.git
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Quick Testing Hint
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    Evaluating the system right now? You don't need to fill out a contact form to explore the full platform. Simply use the <strong>One-Click Demo Account</strong> on the Login page!
                  </p>
                  <button
                    onClick={onLogin}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-black text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Jump into demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </CardTilt3D>
          </div>
        </div>
      </section>
    </div>
  );
}
