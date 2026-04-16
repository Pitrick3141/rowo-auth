import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Database, Trash2, Server } from 'lucide-react';

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
            What We Collect
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We collect only the data required to run identity verification workflows, moderation, and abuse prevention.
          </p>
          <ul className="space-y-3 text-slate-600 ml-2">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
              <span><strong>Account identifiers and status:</strong> WeChat ID, verification method/state, and verification timestamps.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
              <span><strong>Verification artifacts:</strong> email verification records, ADFS verification codes, and Discord verification cache records.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
              <span><strong>Moderation/operations data:</strong> manual review notes, blacklist records, and rate-limit counters.</span>
            </li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Database className="w-6 h-6 text-emerald-600" />
            How Data Is Stored
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We use SHA-256 based keyed hashing for sensitive values in core account storage (for example student identity fields and email/Discord identity links used for deduplication).
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Important storage notes</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>- Some operational fields remain plaintext by design, including WeChat IDs and moderation/admin remarks.</li>
              <li>- Pending email verification rows store plaintext normalized email until completion or expiration handling.</li>
              <li>- We do not return internal exception details to API clients; detailed errors stay in server-side logs.</li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Server className="w-6 h-6 text-purple-600" />
            Service Providers (Subprocessors)
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We rely on third-party infrastructure providers to run specific parts of the service:
          </p>
          <ul className="space-y-3 text-slate-600 ml-2">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5 shrink-0" />
              <span><strong>Cloudflare</strong>: hosts Worker runtime and D1 database.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5 shrink-0" />
              <span><strong>AWS SES</strong>: processes recipient email and email body to deliver verification codes.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5 shrink-0" />
              <span><strong>Discord</strong>: OAuth and guild/role checks for Discord-based verification workflows.</span>
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
            Retention and Removal
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Retention varies by data type and workflow state:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <ul className="space-y-2 text-sm text-slate-600">
              <li>- Email and ADFS verification artifacts are short-lived (minutes) and removed on successful completion or expiry handling paths.</li>
              <li>- Rename tokens are short-lived and removed after use or invalidation.</li>
              <li>- Rate-limit buckets are periodically pruned by backend logic.</li>
              <li>- Verified account records, moderation notes, and blacklist/admin records are retained until updated or manually removed.</li>
            </ul>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            If you want your data removed, contact support and we will process the request through our operational workflow.
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
