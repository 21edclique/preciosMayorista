import React, { createContext, useState, useContext, ReactNode } from "react";

// Define el tipo para el contexto
interface AuthContextType {
  id_rol: number | null;
  id: number | null;
  setIdRolPer: React.Dispatch<React.SetStateAction<number | null>>; // Para actualizar el valor del rol
  setIdUsuario: React.Dispatch<React.SetStateAction<number | null>>; // Para actualizar el valor del rol

}

// Crea un contexto con un valor predeterminado
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crea un proveedor para el contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Aquí debes establecer el valor de id_rol_per, que podría venir de una API o de la sesión del usuario
  const [id, setIdUsuario] = useState<number | null>(null); // Valor predeterminado

  const [id_rol, setIdRolPer] = useState<number | null>(null); // Valor predeterminado

  // Aquí puedes simular el valor para pruebas, puedes reemplazarlo con lo que necesites (como obtenerlo de un backend)
  // setIdRolPer(1); // Para un usuario con rol 1

  return (
    <AuthContext.Provider value={{ id_rol, setIdRolPer, id, setIdUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe ser usado dentro de un AuthProvider");
  }
  return context;
};
