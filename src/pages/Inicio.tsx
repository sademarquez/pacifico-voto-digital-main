import { FC } from "react";

const Inicio: FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-[#e6f0f7]">
      {/* Encabezado */}
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <h1 className="text-4xl font-bold text-gray-700 mb-8 mt-16">Bienvenido</h1>
        {/* Logo grande (placeholder) */}
        <div className="bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6" style={{ width: 280, height: 140 }}>
          <span className="text-5xl font-extrabold text-[#009fe3]">MI</span>
          <span className="ml-2 text-2xl font-bold text-gray-500">CAMPAÑA <span className="text-[#009fe3]">IA</span></span>
        </div>
        <p className="text-lg text-gray-600 font-semibold mb-2">Tu campaña en tiempo real</p>
      </div>
      {/* Redes sociales */}
      <div className="flex gap-8 mb-8">
        <a href="#" className="text-gray-500 hover:text-[#1877f3] text-3xl"><i className="fa-brands fa-facebook-f"></i></a>
        <a href="#" className="text-gray-500 hover:text-[#e4405f] text-3xl"><i className="fa-brands fa-instagram"></i></a>
        <a href="#" className="text-gray-500 hover:text-[#010101] text-3xl"><i className="fa-brands fa-tiktok"></i></a>
      </div>
    </div>
  );
};

export default Inicio; 