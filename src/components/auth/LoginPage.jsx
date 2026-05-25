import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, LogIn, UtensilsCrossed, Users, TrendingUp, Target, FileText } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";
import { login } from "@/service/auth";
import axios from "axios";
import { useToast } from "../ui/use-toast";

export default function LoginPage(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const checkAuth = props.checkAuth
  const { toast } = useToast()

  const handleLogin = async () => {
    // e.preventDefault()
    setIsLoading(true);
    try {
      await login(formData.email, formData.password)
      checkAuth()
      navigate('/dashboard')
    } catch (e) {
      setIsLoading(false)
      if (axios.isAxiosError(e)) {

        const mensajeDeError = e.response?.data?.errorCode ?? 'Error al iniciar sesión';

        setError(mensajeDeError);

        toast({
          variant: "destructive",
          title: "Error al iniciar sesión",
          description: mensajeDeError,
          duration: 3000
        })
      }
    }
  };

  const handlerInput = (e) => {
    const { value, name } = e.target;

    setFormData((prevData) => ({
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
                <UtensilsCrossed className="w-8 h-8" />
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
        </div>

        {/* Right Side - Login Card */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                <UtensilsCrossed className="w-8 h-8" />
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

              {/* Login Button */}
              <div className="space-y-4">
                <Label>
                  Usuario
                </Label>
                <Input value={formData.email} onChange={handlerInput} name="email">
                </Input>

                <Label>
                  Contraseña
                </Label>
                <Input type="password" value={formData.password} onChange={handlerInput} name="password">
                </Input>
                <Button
                  type="button"
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
