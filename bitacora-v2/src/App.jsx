import React, { useState, useEffect } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const STORAGE_KEY = "options_ledger_v2";
const STRATEGIES = ["CSP", "CC", "IC", "CALL", "PUT"];
const STATES = ["ABIERTA", "CERRADA", "ROLL", "ASIGNADA", "VENDIDA"];

const emptyRow = {
  fechaInicio: "",
  fechaVencimiento: "",
  fechaCierre: "",
  ticker: "",
  estrategia: "CSP",
  precioCompra: 0,
  acciones: 100,
  strike: 0,
  primaRecibida: 0,
  comision: 0,
  costoCierre: 0,
  estado: "ABIERTA",
  precioCierre: 0,
  notas: "",
};

function App() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ ...emptyRow });

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "operaciones"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRows(data);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    await addDoc(collection(db, "operaciones"), form);
    setForm({ ...emptyRow });
  };

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📊 Bitácora de Operaciones</h1>

      <div className="grid gap-2 mb-6">
        <input className="text-black p-2 rounded" placeholder="Ticker" value={form.ticker} onChange={(e) => setForm({ ...form, ticker: e.target.value })} />
        <input className="text-black p-2 rounded" placeholder="Fecha Inicio" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} />
        <input className="text-black p-2 rounded" placeholder="Fecha Vencimiento" value={form.fechaVencimiento} onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })} />
        <input className="text-black p-2 rounded" placeholder="Prima" value={form.primaRecibida} onChange={(e) => setForm({ ...form, primaRecibida: e.target.value })} />
        <button className="bg-green-600 hover:bg-green-700 p-2 rounded flex items-center justify-center" onClick={handleSave}>
          <Save className="mr-2" /> Guardar
        </button>
      </div>

      <div className="grid gap-4">
        {rows.map((row) => (
          <div key={row.id} className="p-4 border rounded bg-gray-800 flex justify-between">
            <div>
              <p className="font-semibold">{row.ticker}</p>
              <p className="text-sm text-gray-400">{row.estrategia} — {row.estado}</p>
            </div>
            <p className="text-green-400">${row.primaRecibida}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
