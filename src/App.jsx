import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import RequireRole from './components/RequireRole'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import ProcessosList from './pages/processos/ProcessosList'
import ProcessoForm from './pages/processos/ProcessoForm'
import ProcessoDetail from './pages/processos/ProcessoDetail'
import AudienciasList from './pages/audiencias/AudienciasList'
import AudienciaForm from './pages/audiencias/AudienciaForm'
import PrazosList from './pages/prazos/PrazosList'
import PrazoForm from './pages/prazos/PrazoForm'
import DocumentosList from './pages/documentos/DocumentosList'
import DocumentoUpload from './pages/documentos/DocumentoUpload'
import ClientesList from './pages/clientes/ClientesList'
import ClienteDetail from './pages/clientes/ClienteDetail'
import AdvogadosList from './pages/advogados/AdvogadosList'
import TribunaisList from './pages/tribunais/TribunaisList'
import ContratosList from './pages/contratos/ContratosList'
import ContratoForm from './pages/contratos/ContratoForm'
import HonorariosList from './pages/honorarios/HonorariosList'
import Notificacoes from './pages/notificacoes/Notificacoes'
import Relatorios from './pages/relatorios/Relatorios'
import Configuracao from './pages/configuracao/Configuracao'
import './App.css'

const ADMIN = ['Administrador']
const ADV   = ['Administrador', 'Advogado']

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

        <Route path="/processos"          element={<RequireAuth><ProcessosList /></RequireAuth>} />
        <Route path="/processos/novo"     element={<RequireAuth><RequireRole roles={ADV}><ProcessoForm /></RequireRole></RequireAuth>} />
        <Route path="/processos/:id"      element={<RequireAuth><ProcessoDetail /></RequireAuth>} />
        <Route path="/processos/:id/editar" element={<RequireAuth><RequireRole roles={ADV}><ProcessoForm /></RequireRole></RequireAuth>} />

        <Route path="/audiencias"         element={<RequireAuth><AudienciasList /></RequireAuth>} />
        <Route path="/audiencias/nova"    element={<RequireAuth><RequireRole roles={ADV}><AudienciaForm /></RequireRole></RequireAuth>} />
        <Route path="/audiencias/:id/editar" element={<RequireAuth><RequireRole roles={ADV}><AudienciaForm /></RequireRole></RequireAuth>} />

        <Route path="/prazos"             element={<RequireAuth><PrazosList /></RequireAuth>} />
        <Route path="/prazos/novo"        element={<RequireAuth><RequireRole roles={ADV}><PrazoForm /></RequireRole></RequireAuth>} />

        <Route path="/documentos"         element={<RequireAuth><DocumentosList /></RequireAuth>} />
        <Route path="/documentos/upload"  element={<RequireAuth><RequireRole roles={ADV}><DocumentoUpload /></RequireRole></RequireAuth>} />

        <Route path="/clientes"           element={<RequireAuth><RequireRole roles={ADV}><ClientesList /></RequireRole></RequireAuth>} />
        <Route path="/clientes/:id"       element={<RequireAuth><RequireRole roles={ADV}><ClienteDetail /></RequireRole></RequireAuth>} />

        <Route path="/advogados"          element={<RequireAuth><RequireRole roles={ADMIN}><AdvogadosList /></RequireRole></RequireAuth>} />
        <Route path="/tribunais"          element={<RequireAuth><RequireRole roles={ADMIN}><TribunaisList /></RequireRole></RequireAuth>} />

        <Route path="/contratos"          element={<RequireAuth><RequireRole roles={ADV}><ContratosList /></RequireRole></RequireAuth>} />
        <Route path="/contratos/novo"     element={<RequireAuth><RequireRole roles={ADV}><ContratoForm /></RequireRole></RequireAuth>} />

        <Route path="/honorarios"         element={<RequireAuth><RequireRole roles={ADV}><HonorariosList /></RequireRole></RequireAuth>} />

        <Route path="/notificacoes"       element={<RequireAuth><Notificacoes /></RequireAuth>} />
        <Route path="/relatorios"         element={<RequireAuth><RequireRole roles={ADV}><Relatorios /></RequireRole></RequireAuth>} />
        <Route path="/configuracao"       element={<RequireAuth><RequireRole roles={ADMIN}><Configuracao /></RequireRole></RequireAuth>} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
