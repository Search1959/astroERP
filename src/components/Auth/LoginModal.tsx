/**
 * Role Switcher & Login Modal
 */

import React, { useState } from 'react';
import { User } from '../../types';
import { X, Shield, Lock, UserCheck, Key } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User | null;
  onSwitchUser: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSwitchUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Switch Active Staff Account</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Switch between Administrator, Vedic Astrologer, and Inventory Staff accounts to test role-based access control.
        </p>

        <div className="space-y-2.5">
          {users.map(u => {
            const isCurrent = currentUser?.id === u.id;

            return (
              <div
                key={u.id}
                onClick={() => {
                  onSwitchUser(u);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                    isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-100 border border-slate-200 text-slate-700'
                  }`}>
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {u.name}
                      {isCurrent && (
                        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{u.title || u.role} • {u.email}</div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  u.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                  u.role === 'astrologer' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {u.role}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          Role-Based Access Control (RBAC) System
        </div>
      </div>
    </div>
  );
};
