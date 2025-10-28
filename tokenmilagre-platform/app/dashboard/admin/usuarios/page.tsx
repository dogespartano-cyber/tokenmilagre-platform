'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faArrowLeft,
  faSpinner,
  faExclamationTriangle,
  faFilter,
  faUserShield,
  faUserEdit,
  faUserTag,
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faSave,
  faEye,
  faEyeSlash,
  faNewspaper
} from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  image: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    articles: number;
  };
}

interface CreateUserForm {
  email: string;
  name: string;
  password: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

interface EditUserForm {
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  password: string; // Opcional - só atualiza se preenchido
}

export default function GerenciarUsuariosPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Filters
  const [roleFilter, setRoleFilter] = useState<'all' | 'ADMIN' | 'EDITOR' | 'VIEWER'>('all');

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    email: '',
    name: '',
    password: '',
    role: 'VIEWER'
  });

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editForm, setEditForm] = useState<EditUserForm>({
    name: '',
    email: '',
    role: 'VIEWER',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (roleFilter !== 'all') {
        params.set('role', roleFilter);
      }

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao buscar usuários');
      }

      setUsers(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!createForm.email || !createForm.password || !createForm.role) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao criar usuário');
      }

      alert('Usuário criado com sucesso!');
      setShowCreateModal(false);
      setCreateForm({ email: '', name: '', password: '', role: 'VIEWER' });
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar usuário');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!editingUser) return;

    setEditing(true);
    try {
      // Só envia campos que foram alterados
      const updateData: any = {};
      if (editForm.name !== editingUser.name) updateData.name = editForm.name;
      if (editForm.email !== editingUser.email) updateData.email = editForm.email;
      if (editForm.role !== editingUser.role) updateData.role = editForm.role;
      if (editForm.password) updateData.password = editForm.password; // Só atualiza se preenchido

      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao atualizar usuário');
      }

      alert('Usuário atualizado com sucesso!');
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (session?.user?.id === id) {
      alert('Você não pode deletar sua própria conta!');
      return;
    }

    if (!confirm(`Tem certeza que deseja deletar o usuário "${email}"?`)) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao deletar usuário');
      }

      alert('Usuário deletado com sucesso!');
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar');
    } finally {
      setDeleting(null);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email,
      role: user.role,
      password: ''
    });
    setShowEditModal(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { bg: '#dcfce7', color: '#166534', icon: faUserShield };
      case 'EDITOR':
        return { bg: '#dbeafe', color: '#1e40af', icon: faUserEdit };
      case 'VIEWER':
        return { bg: '#f3f4f6', color: '#374151', icon: faUserTag };
      default:
        return { bg: '#f3f4f6', color: '#374151', icon: faUserTag };
    }
  };

  const filteredUsers = users.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }
    return true;
  });

  return (
    <AdminRoute allowEditor={false}>
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Voltar ao Admin
            </Link>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1
                  className="text-4xl font-bold font-[family-name:var(--font-poppins)] mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <FontAwesomeIcon icon={faUsers} className="mr-3" />
                  Gerenciar Usuários
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                  {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                  color: 'white'
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                Criar Novo Usuário
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="rounded-xl p-4 mb-6 border flex items-start gap-3"
              style={{
                backgroundColor: '#fef2f2',
                borderColor: '#ef4444',
              }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">Erro</p>
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={fetchUsers}
                  className="mt-2 text-sm font-semibold text-red-700 hover:underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Filter */}
          <div
            className="rounded-2xl p-6 border shadow-lg mb-6"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)'
            }}
          >
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                Filtrar por Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="w-full md:w-64 px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="all">Todos</option>
                <option value="ADMIN">Admin</option>
                <option value="EDITOR">Editor</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="flex justify-center py-12">
              <FontAwesomeIcon
                icon={faSpinner}
                className="w-12 h-12 animate-spin"
                style={{ color: 'var(--brand-primary)' }}
              />
            </div>
          ) : (
            <div
              className="rounded-2xl border shadow-lg overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Usuário
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Artigos
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Cadastrado em
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => {
                      const roleStyle = getRoleBadgeColor(user.role);
                      return (
                        <tr
                          key={user.id}
                          className="border-t transition-colors hover:bg-opacity-50"
                          style={{
                            borderColor: 'var(--border-light)',
                            backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--bg-secondary)'
                          }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {/* Avatar */}
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                                style={{
                                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))'
                                }}
                              >
                                {(user.name || user.email).charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                  {user.name || 'Sem nome'}
                                </p>
                                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                              style={{
                                backgroundColor: roleStyle.bg,
                                color: roleStyle.color
                              }}
                            >
                              <FontAwesomeIcon icon={roleStyle.icon} className="w-3 h-3" />
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center gap-2 text-sm"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <FontAwesomeIcon icon={faNewspaper} className="w-3 h-3" />
                              {user._count.articles}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                              {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {/* Edit */}
                              <button
                                onClick={() => openEditModal(user)}
                                className="p-2 rounded-lg transition-all hover:scale-110"
                                style={{
                                  backgroundColor: 'var(--bg-secondary)',
                                  color: 'var(--text-primary)'
                                }}
                                title="Editar"
                              >
                                <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(user.id, user.email)}
                                disabled={deleting === user.id || session?.user?.id === user.id}
                                className="p-2 rounded-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                  backgroundColor: '#fee2e2',
                                  color: '#991b1b'
                                }}
                                title={session?.user?.id === user.id ? 'Não pode deletar a si mesmo' : 'Deletar'}
                              >
                                {deleting === user.id ? (
                                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                                ) : (
                                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Empty State */}
                {filteredUsers.length === 0 && !loading && (
                  <div className="py-12 text-center">
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                      Nenhum usuário encontrado
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-md rounded-2xl border-2 shadow-2xl p-6"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-medium)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Criar Novo Usuário
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg transition-all hover:bg-opacity-50"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="usuario@exemplo.com"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Nome
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Nome completo"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Senha * (mínimo 6 caracteres)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 pr-12 rounded-lg border focus:outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-medium)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Role *
                </label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="VIEWER">Viewer (Somente visualização)</option>
                  <option value="EDITOR">Editor (Criar artigos)</option>
                  <option value="ADMIN">Admin (Acesso total)</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-bold transition-all hover:opacity-80 border-2"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex-1 px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50 shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white'
                  }}
                >
                  {creating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="mr-2" />
                      Criar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-md rounded-2xl border-2 shadow-2xl p-6"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-medium)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Editar Usuário
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-lg transition-all hover:bg-opacity-50"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Nome
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Nova Senha (deixe vazio para não alterar)
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 pr-12 rounded-lg border focus:outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-medium)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <FontAwesomeIcon icon={showEditPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                  disabled={session?.user?.id === editingUser.id}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="VIEWER">Viewer</option>
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {session?.user?.id === editingUser.id && (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    Você não pode alterar sua própria role
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-bold transition-all hover:opacity-80 border-2"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEdit}
                  disabled={editing}
                  className="flex-1 px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50 shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white'
                  }}
                >
                  {editing ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="mr-2" />
                      Salvar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminRoute>
  );
}
