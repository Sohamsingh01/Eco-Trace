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
    <div className="space-y-20 pb-24 text-white">
      {/* 1. HERO HEADER */}
      <section className="pt-8 lg:pt-14 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
          <MessageSquare className="w-4 h-4" />
          <span>Connect With EcoTrace</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Let's Build a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
            Greener Future Together
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
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
              className="rounded-3xl bg-[#092215]/90 border border-emerald-500/30 p-8 sm:p-10 shadow-2xl backdrop-blur-xl"
            >
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white">Send us a Message</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Fill out the form below and our team will get back to you promptly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-gray-300">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-3 rounded-xl bg-[#06170E] border border-emerald-500/20 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-gray-300">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="priya@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#06170E] border border-emerald-500/20 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-300">Inquiry Topic</label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#06170E] border border-emerald-500/20 text-white text-xs focus:outline-none focus:border-emerald-400 transition"
                    >
                      <option value="evaluation">Academic & Capstone Evaluation</option>
                      <option value="society">Residential Society Pilot Program</option>
                      <option value="methodology">Scientific Methodology Question</option>
                      <option value="partnership">Brand & Rewards Voucher Partnership</option>
                      <option value="other">General Feedback / Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-300">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your household, society, or inquiry details..."
                      className="w-full px-4 py-3 rounded-xl bg-[#06170E] border border-emerald-500/20 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-charcoal-950 font-black text-xs shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Thank You, {formData.name}!</h3>
                  <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                    Your inquiry has been received. Our team will review your message and reply
                    to <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-white/10 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </CardTilt3D>
          </div>

          {/* Right Column: Channels & Pilot Program (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Housing Society Pilot Card */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-[#0B2517] to-[#07190F] border border-emerald-500/30 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-300 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-base text-white">Housing Society Pilots</h4>
                  <span className="text-xs text-emerald-400 font-bold">Apartment Complexes & Campuses</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Want to run a green competition between apartment wings or resident towers?
                We configure private leaderboard cohorts with shared conservation goals.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setFormData({ ...formData, topic: "society" })}
                  className="text-xs font-bold text-lime-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Select Society Pilot in Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Project & Open Source Links */}
            <div className="p-7 rounded-3xl bg-[#092215]/80 border border-emerald-500/20 space-y-4">
              <h4 className="font-black text-sm uppercase text-gray-300 tracking-wider">
                Project & Community Hubs
              </h4>

              <div className="space-y-3 text-xs">
                <a
                  href="https://github.com/Sohamsingh01/Eco-Trace.git"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-[#06170E] border border-emerald-500/20 flex items-center justify-between hover:border-emerald-400/50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 fill-emerald-400 shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                    <div>
                      <span className="font-bold text-white block">GitHub Repository</span>
                      <span className="text-[10px] text-gray-400">Open source code, schemas, and tests</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition" />
                </a>

                <div className="p-3.5 rounded-2xl bg-[#06170E] border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">Engineering Capstone</span>
                      <span className="text-[10px] text-gray-400">Final Year Academic Project</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10">
                    2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
