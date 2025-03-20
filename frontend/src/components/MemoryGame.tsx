import React, { useState, useEffect } from "react";

type Kart = {
  id: number;
  deger: string;
  eslesme: boolean;
};

const kartlarVeri: Kart[] = [
  { id: 1, deger: "🍎", eslesme: false },
  { id: 2, deger: "🍌", eslesme: false },
  { id: 3, deger: "🍇", eslesme: false },
  { id: 4, deger: "🍓", eslesme: false },
  { id: 5, deger: "🍍", eslesme: false },
  { id: 6, deger: "🍉", eslesme: false },
  { id: 7, deger: "🥝", eslesme: false },
  { id: 8, deger: "🍒", eslesme: false },
  { id: 9, deger: "🍎", eslesme: false },
  { id: 10, deger: "🍌", eslesme: false },
  { id: 11, deger: "🍇", eslesme: false },
  { id: 12, deger: "🍓", eslesme: false },
  { id: 13, deger: "🍍", eslesme: false },
  { id: 14, deger: "🍉", eslesme: false },
  { id: 15, deger: "🥝", eslesme: false },
  { id: 16, deger: "🍒", eslesme: false },
];

const kartlariKaristir = (): Kart[] => {
  return [...kartlarVeri].sort(() => Math.random() - 0.5);
};

export default function HafizaOyunu() {
  const [kartlar, setKartlar] = useState<Kart[]>(kartlariKaristir());
  const [secilenKartlar, setSecilenKartlar] = useState<number[]>([]);
  const [eslesenCiftler, setEslesenCiftler] = useState<number>(0);
  const [hamleler, setHamleler] = useState<number>(0);

  useEffect(() => {
    if (secilenKartlar.length === 2) {
      const [ilk, ikinci] = secilenKartlar;
      setHamleler((prev) => prev + 1);
      if (kartlar[ilk].deger === kartlar[ikinci].deger) {
        setKartlar((prev) =>
          prev.map((kart, index) =>
            index === ilk || index === ikinci ? { ...kart, eslesme: true } : kart
          )
        );
        setEslesenCiftler((prev) => prev + 1);
      }
      setTimeout(() => setSecilenKartlar([]), 800);
    }
  }, [secilenKartlar, kartlar]);

  const kartTikla = (index: number) => {
    if (secilenKartlar.length < 2 && !secilenKartlar.includes(index) && !kartlar[index].eslesme) {
      setSecilenKartlar([...secilenKartlar, index]);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Hafıza Oyunu</h1>
      <p className="mb-2">Hamleler: {hamleler}</p>
      <div className="grid grid-cols-4 gap-4">
        {kartlar.map((kart, index) => (
          <div
            key={kart.id}
            className={`w-16 h-16 flex items-center justify-center border rounded-lg cursor-pointer text-2xl transition-all duration-300 ${
              kart.eslesme || secilenKartlar.includes(index) ? "bg-blue-300" : "bg-gray-300"
            }`}
            onClick={() => kartTikla(index)}
          >
            {kart.eslesme || secilenKartlar.includes(index) ? kart.deger : "❓"}
          </div>
        ))}
      </div>
      {eslesenCiftler === kartlarVeri.length / 2 && (
        <div className="mt-4 text-lg font-bold text-green-600">
          Tebrikler! Tüm eşleşmeleri buldunuz! 🎉
        </div>
      )}
    </div>
  );
}
