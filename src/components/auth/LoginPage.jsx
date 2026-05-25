
import React, { useState } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, LogIn, UtensilsCrossed, Users, TrendingUp, Target, FileText } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] =  useState({
    user: "",
    pass: ""
  })
  const navigate = useNavigate()

  const handleLogin = () => {
    setIsLoading(true);
    // Esta función redirige al usuario al sistema de login seguro de la plataforma
      if(User.user == formData.user && User.password == formData.pass){
        localStorage.setItem('auth', JSON.stringify({...formData, "pass": "dsvbu"}))
        alert("logueado")
        window.location.reload();
      }
      else{
          alert("contraseña o usuario incorrecto")
          setIsLoading(false);
      }
  };

  const manejologin = (e) => {
    const {value, name} = e.target;

    setFormData((prevData)=>({
      ...prevData,
      [name]: value
    }))
    
  }

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Branding & Info */}
        <div className="text-white space-y-8">
          <div className="space-y-6 text-gray-900">
            {/* Logo y Título Principal */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <UtensilsCrossed  className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">El Punto Chévere</h1>
                <p className="text-gray-900 text-lg">Comida venezolana</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                Sistema de Gestión y Visualización de Indicadores
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Plataforma integral para el monitoreo, análisis y reporte de indicadores 
                de rendimiento comercial.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <TrendingUp className="w-6 h-6 text-blue-300 mt-1" />
              <div>
                <h3 className="font-semibold text-white">Indicadores Dinámicos</h3>
                <p className="text-blue-200 text-sm">Monitoreo en tiempo real con alertas automáticas</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Target className="w-6 h-6 text-blue-300 mt-1" />
              <div>
                <h3 className="font-semibold text-white">Gestión de Metas</h3>
                <p className="text-blue-200 text-sm">Definición y seguimiento de objetivos institucionales</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <FileText className="w-6 h-6 text-blue-300 mt-1" />
              <div>
                <h3 className="font-semibold text-white">Reportes Avanzados</h3>
                <p className="text-blue-200 text-sm">Informes personalizables y exportación a PDF</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Users className="w-6 h-6 text-blue-300 mt-1" />
              <div>
                <h3 className="font-semibold text-white">Control de Acceso</h3>
                <p className="text-blue-200 text-sm">Roles y permisos granulares por área</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Right Side - Login Card */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                <UtensilsCrossed  className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Acceso al Sistema
                </CardTitle>
                <p className="text-slate-600 mt-2">
                  Ingrese con sus credenciales
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Security Features */}
              {/* <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Acceso Seguro</p>
                    <p className="text-xs text-slate-600">Autenticación institucional protegida</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Roles Diferenciados</p>
                    <p className="text-xs text-slate-600">Permisos según su área de trabajo</p>
                  </div>
                </div>
              </div> */}

              {/* Login Button */}
              <div className="space-y-4">
                <Label>
                  Usuario
                </Label>
                <Input value = {formData.user} onChange = {manejologin} name = "user">
                </Input>

                <Label>
                  Contraseña
                </Label>                
                <Input type = "password" value = {formData.pass} onChange = {manejologin} name = "pass">
                </Input>
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 text-lg font-semibold shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verificando acceso...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Iniciar Sesión
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Al acceder, acepta las políticas de uso y privacidad del sistema
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              {/* <div className="pt-4 border-t border-slate-100">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      ¿Necesita acceso al sistema?
                    </p>
                    <div className="text-xs text-slate-500 space-y-1">
                      <p>• Contacte al administrador de su área para solicitar una invitación</p>
                      <p>• Si tiene email institucional, puede crear una cuenta Google gratuita</p>
                      <p>• Para soporte técnico: contacte a IT de SEDRONAR</p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800 font-medium">
                      💡 ¿No tiene cuenta Google?
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Puede crear una cuenta Google gratuita usando su email institucional sin cambiar su dirección de correo actual.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800 font-medium">
                      📞 Soporte Técnico
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Para asistencia con el acceso, contacte a la Mesa de Ayuda de SEDRONAR
                    </p>
                  </div>
                </div>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-gray-700 text-sm">
          {"© 2026 Desarrollado por </HDEV> v1.0"}
        </p>
      </div>
    </div>
  );
}
