import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, Users } from "lucide-react";

export default function InviteUserDialog({ onOpenChange }) {
  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
            </div>
            <DialogTitle className="text-xl">Invitar Nuevos Usuarios</DialogTitle>
          </div>
        </DialogHeader>
        <div className="text-slate-600 space-y-4">
            <p>
                Para agregar nuevos usuarios al sistema, por favor utilice la funcionalidad de 
                <strong className="text-slate-800"> "Invitar Usuario"</strong> disponible en el panel de administración de su aplicación en la plataforma Base44.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="py-1">
                        <Info className="h-5 w-5 text-blue-500 mr-3" />
                    </div>
                    <div>
                        <p className="font-semibold">Pasos a seguir:</p>
                        <ol className="list-decimal list-inside text-sm mt-1">
                            <li>Vaya a la pestaña "Workspace" en la barra lateral de Base44.</li>
                            <li>Seleccione la opción "Users".</li>
                            <li>Haga clic en el botón "Invite User".</li>
                            <li>Ingrese el email y asigne un rol inicial.</li>
                        </ol>
                    </div>
                </div>
            </div>
            <p>
                Una vez que el usuario acepte la invitación, aparecerá en este listado y podrá editar sus detalles y permisos específicos.
            </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Entendido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}