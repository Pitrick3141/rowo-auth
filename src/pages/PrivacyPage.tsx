import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, EyeOff, Trash2, Link as LinkIcon } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-200">
          <Shield className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          We take your privacy seriously. Here is how we handle and protect your data.
        </p>
      </motion.div>

      <div className="space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-indigo-600" />
            Secure Data Storage
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            All sensitive user information is stored as <strong>salted SHA-256 hashes</strong> in our database. This means we do not store your actual data (like your email or student ID) in plain text.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-slate-500" />
              What is SHA-256?
            </h3>
            <p className="text-sm text-slate-600">
              SHA-256 is a cryptographic hash function that converts your data into a unique, fixed-size string of characters. It is a one-way function, meaning it is computationally infeasible to reverse the hash back to the original data. This ensures your information remains secure even in the unlikely event of a database breach.
              <br />
              <a href="https://en.wikipedia.org/wiki/SHA-2" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium mt-2 inline-block">
                Learn more about SHA-256 on Wikipedia &rarr;
              </a>
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <EyeOff className="w-6 h-6 text-emerald-600" />
            No Plaintext Logging
          </h2>
          <p className="text-slate-600 leading-relaxed">
            While plaintext user information may be sent to our servers temporarily (for example, your email address to send a verification code), <strong>this data is never stored or logged</strong> in its plaintext form. It is only held in memory for the duration of the request and is immediately discarded or hashed.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-600" />
            Purpose of Data Collection
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Your stored information will <strong>never be shared with third parties</strong>. It is used strictly for verification purposes, including:
          </p>
          <ul className="space-y-3 text-slate-600 ml-2">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5 shrink-0" />
              <span>Re-verifying your identity when you want to change your linked WeChat ID.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5 shrink-0" />
              <span>Ensuring that no duplicate verifications exist for the same student identity.</span>
            </li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Trash2 className="w-6 h-6 text-red-600" />
            Data Removal
          </h2>
          <p className="text-slate-600 leading-relaxed">
            You have full control over your data. You can contact our support team at any time to request the complete removal of your information from our database.
          </p>
          <div className="mt-6">
            <a
              href="mailto:dev@rowo.link"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              Contact Support
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
