import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import { PrivateRoute } from './components/layout/PrivateRoute';
import LandingPage from './pages/LandingPage';
import { Login } from './pages/auth/Login.tsx';
import { Register } from './pages/auth/Register.tsx';
import { Dashboard } from './pages/dashboard/Dashboard.tsx';
import { ProcessosList } from './pages/processos/ProcessosList.tsx';
import { ProcessoForm } from './pages/processos/ProcessoForm.tsx';
import { ProcessoDetail } from './pages/processos/ProcessoDetail.tsx';
import { AudienciasList } from './pages/audiencias/AudienciasList.tsx';
import { AudienciaForm } from './pages/audiencias/AudienciaForm.tsx';
import { PrazosList } from './pages/prazos/PrazosList.tsx';
import { PrazoForm } from './pages/prazos/PrazoForm.tsx';
import { DocumentosList } from './pages/documentos/DocumentosList.tsx';
import { DocumentoUpload } from './pages/documentos/DocumentoUpload.tsx';
import { ClientesList } from './pages/clientes/ClientesList.tsx';
import { ClienteDetail } from './pages/clientes/ClienteDetail.tsx';
import { AdvogadosList } from './pages/advogados/AdvogadosList.tsx';
import { TribunaisList } from './pages/tribunais/TribunaisList.tsx';
import { ContratosList } from './pages/contratos/ContratosList.tsx';
import { ContratoForm } from './pages/contratos/ContratoForm.tsx';
import { HonorariosList } from './pages/honorarios/HonorariosList.tsx';
import { Notificacoes } from './pages/notificacoes/Notificacoes.tsx';
import { Relatorios } from './pages/relatorios/Relatorios.tsx';
import { Configuracao } from './pages/configuracao/Configuracao.tsx';
import { MovimentacoesList } from './pages/movimentacoes/MovimentacoesList.tsx';
import './App.css';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } });

const ADMIN = ['Administrador'];
const ADV   = ['Administrador', 'Advogado'];

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          {/* página institucional pública */}
          <Route index element={<LandingPage />} />

          {/* autenticação: tela cheia, sem sidebar */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* rotas internas — exigem autenticação + Layout YBY-style */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<PrivateRoute roles={ADV}><Dashboard /></PrivateRoute>} />

            <Route path="/processos"          element={<ProcessosList />} />
            <Route path="/processos/novo"     element={<PrivateRoute roles={ADV}><ProcessoForm /></PrivateRoute>} />
            <Route path="/processos/:id"      element={<ProcessoDetail />} />
            <Route path="/processos/:id/editar" element={<PrivateRoute roles={ADV}><ProcessoForm /></PrivateRoute>} />

            <Route path="/audiencias"         element={<AudienciasList />} />
            <Route path="/audiencias/nova"    element={<PrivateRoute roles={ADV}><AudienciaForm /></PrivateRoute>} />
            <Route path="/audiencias/:id/editar" element={<PrivateRoute roles={ADV}><AudienciaForm /></PrivateRoute>} />

            <Route path="/prazos"             element={<PrazosList />} />
            <Route path="/prazos/novo"        element={<PrivateRoute roles={ADV}><PrazoForm /></PrivateRoute>} />
            <Route path="/prazos/:id/editar"  element={<PrivateRoute roles={ADV}><PrazoForm /></PrivateRoute>} />

            <Route path="/documentos"         element={<DocumentosList />} />
            <Route path="/documentos/upload"  element={<PrivateRoute roles={ADV}><DocumentoUpload /></PrivateRoute>} />

            <Route path="/clientes"           element={<PrivateRoute roles={ADV}><ClientesList /></PrivateRoute>} />
            <Route path="/clientes/:id"       element={<PrivateRoute roles={ADV}><ClienteDetail /></PrivateRoute>} />

            <Route path="/advogados"          element={<PrivateRoute roles={ADMIN}><AdvogadosList /></PrivateRoute>} />
            <Route path="/tribunais"          element={<PrivateRoute roles={ADMIN}><TribunaisList /></PrivateRoute>} />

            <Route path="/contratos"          element={<PrivateRoute roles={ADV}><ContratosList /></PrivateRoute>} />
            <Route path="/contratos/novo"     element={<PrivateRoute roles={ADV}><ContratoForm /></PrivateRoute>} />

            <Route path="/honorarios"         element={<PrivateRoute roles={ADV}><HonorariosList /></PrivateRoute>} />
            <Route path="/movimentacoes"      element={<PrivateRoute roles={ADV}><MovimentacoesList /></PrivateRoute>} />
            <Route path="/notificacoes"       element={<Notificacoes />} />
            <Route path="/relatorios"         element={<PrivateRoute roles={ADV}><Relatorios /></PrivateRoute>} />
            <Route path="/configuracao"       element={<PrivateRoute roles={ADMIN}><Configuracao /></PrivateRoute>} />
          </Route>

          {/* 404 — vai para login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
