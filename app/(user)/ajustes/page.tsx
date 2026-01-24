"use client"

import { useState } from "react"
import { ShieldCheck, Bell } from "lucide-react"

export default function AjustesPage() {
  const [activeModal, setActiveModal] = useState<"email" | "password" | null>(null)

  return (
    /* Reducido pt-32 a pt-20 para subir el contenido */
    <div className="max-w-4xl mx-auto px-6 pt-20 pb-20">
      <header className="mb-10">
        <h1 className="font-serif text-4xl mb-2">Ajustes</h1>
        <p className="text-sm text-black/40 italic font-light tracking-wide">
          Gestiona la seguridad y el acceso a tu santuario personal.
        </p>
      </header>

      <div className="space-y-8">
        
        {/* SECCIÓN: ACCESO Y SEGURIDAD */}
        <section className="bg-white border border-black/[0.05] rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck size={18} className="text-black/20" />
            <h2 className="text-[10px] tracking-[0.2em] font-bold text-black/40 uppercase">Acceso y Seguridad</h2>
          </div>
          
          <div className="space-y-8">
            {/* Cambio de Correo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.03] pb-8">
              <div className="space-y-1">
                <p className="text-[11px] font-bold tracking-widest uppercase text-black/80">Correo Electrónico</p>
                <p className="text-sm text-black/60 italic font-light">usuario@ejemplo.com</p>
              </div>
              <button 
                onClick={() => setActiveModal("email")}
                className="text-[10px] font-bold border border-black/10 px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-widest"
              >
                Actualizar Correo
              </button>
            </div>

            {/* Cambio de Contraseña */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] font-bold tracking-widest uppercase text-black/80">Contraseña</p>
                <p className="text-sm text-black/60 italic font-light">••••••••••••••••</p>
              </div>
              <button 
                onClick={() => setActiveModal("password")}
                className="text-[10px] font-bold border border-black/10 px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-widest"
              >
                Cambiar Clave
              </button>
            </div>
          </div>
        </section>

        {/* SECCIÓN: COMUNICACIONES */}
        <section className="px-8 py-4">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={18} className="text-black/20" />
            <h2 className="text-[10px] tracking-[0.2em] font-bold text-black/40 uppercase">Comunicaciones</h2>
          </div>
          <div className="flex items-center justify-between bg-neutral-50/50 p-6 rounded-2xl border border-black/[0.03]">
            <p className="text-sm text-black/70 italic font-light">Recibir avisos de nuevas clases y meditaciones</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-black/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </section>
      </div>

      {/* MODAL (Se mantiene igual) */}
      {activeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 text-black">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="font-serif text-2xl mb-6 text-black">
              {activeModal === "email" ? "Actualizar Correo" : "Cambiar Contraseña"}
            </h3>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
              {activeModal === "email" ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 text-black">Nuevo Email</label>
                  <input type="email" className="w-full border-b border-black/10 py-2 outline-none italic text-sm text-black" placeholder="nuevo@correo.com" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 text-black">Contraseña Actual</label>
                    <input type="password" className="w-full border-b border-black/10 py-2 outline-none italic text-sm text-black" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 text-black">Nueva Contraseña</label>
                    <input type="password" className="w-full border-b border-black/10 py-2 outline-none italic text-sm text-black" />
                  </div>
                </>
              )}
              
              <div className="pt-4 flex flex-col gap-3">
                <button type="submit" className="w-full bg-black text-white text-[10px] font-bold tracking-widest py-4 rounded-full uppercase hover:opacity-90 transition-opacity">
                  Guardar Cambios
                </button>
                <button type="button" onClick={() => setActiveModal(null)} className="w-full text-[10px] font-bold tracking-widest py-4 uppercase text-black/40 text-black">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
