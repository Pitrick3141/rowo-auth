import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Users, Server, Github, ExternalLink, Shield, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200 overflow-hidden">
          <img src={__ICON_URL__} alt="ROwO Auth Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
          About ROwO Auth
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
          A secure, centralized identity verification system designed to streamline student authentication across multiple platforms and services.
        </p>
        <a
          href="mailto:dev@rowo.link"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Mail className="w-5 h-5" />
          Contact Developer
        </a>
      </motion.div>

      <div className="space-y-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-indigo-600" />
            Our Mission
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            ROwO Auth was created to solve the fragmented identity problem within student communities. By providing a single source of truth for student verification, we enable community organizers, developers, and administrators to easily verify user identities without building custom authentication flows from scratch.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our goal is to protect student-only spaces from unauthorized access while maintaining a frictionless experience for legitimate users.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-600" />
            For Users
          </h2>
          <ul className="space-y-4 text-slate-600">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
              <span className="text-lg">Verify your student status once, use it everywhere.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
              <span className="text-lg">Multiple verification methods (ADFS, Email, Discord, Manual).</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
              <span className="text-lg">Privacy-first approach to data handling.</span>
            </li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-600" />
            For Group Owners
          </h2>
          <ul className="space-y-4 text-slate-600">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2.5 shrink-0" />
              <span className="text-lg">Use this service to verify student status before they join your group.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2.5 shrink-0" />
              <span className="text-lg">Discord server owners can contact the developer to set up their server as a trusted verification source.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2.5 shrink-0" />
              <span className="text-lg">Members with a verified role in a trusted server can be verified easily.</span>
            </li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform -rotate-6">
              Coming Soon
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Server className="w-6 h-6 text-blue-600" />
            For Developers
          </h2>
          <ul className="space-y-4 text-slate-600">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 shrink-0" />
              <span className="text-lg">Simple API for querying verification status.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 shrink-0" />
              <span className="text-lg">Reduce duplicate verification efforts.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 shrink-0" />
              <span className="text-lg">Reliable infrastructure backed by PiTrick Technology.</span>
            </li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg transform rotate-3">
              Coming Soon
            </span>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Open Source & Community Driven</h2>
            <p className="text-slate-300 mb-6 max-w-xl">
              We believe in transparency and collaboration. ROwO Auth is built with modern web technologies and is continuously improved by our community.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                <Github className="w-5 h-5" />
                View Source Code
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white border border-slate-700 rounded-xl font-medium hover:bg-slate-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                API Documentation
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
