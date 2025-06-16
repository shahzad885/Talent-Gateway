import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Activity, 
  Settings, 
  BarChart3, 
  Shield, 
  Bell,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const stats = {
    totalUsers: 1247,
    activeProjects: 38,
    pendingApprovals: 12,
    systemHealth: 98.5
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', joinDate: '2024-03-15' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'Manager', status: 'Active', joinDate: '2024-03-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Pending', joinDate: '2024-03-13' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'User', status: 'Inactive', joinDate: '2024-03-12' },
  ];

  const pendingProjects = [
    { id: 1, title: 'E-commerce Platform', author: 'Alice Brown', submitted: '2024-03-16', priority: 'High' },
    { id: 2, title: 'Mobile App UI', author: 'Bob Davis', submitted: '2024-03-15', priority: 'Medium' },
    { id: 3, title: 'Data Analytics Tool', author: 'Carol White', submitted: '2024-03-14', priority: 'High' },
  ];

  const activityLog = [
    { id: 1, action: 'User registered', user: 'John Doe', time: '2 hours ago', type: 'user' },
    { id: 2, action: 'Project approved', user: 'Admin', time: '4 hours ago', type: 'project' },
    { id: 3, action: 'System backup completed', user: 'System', time: '6 hours ago', type: 'system' },
    { id: 4, action: 'New project submitted', user: 'Sarah Smith', time: '8 hours ago', type: 'project' },
  ];

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{backgroundColor: '#B8C8D9'}}>
          <Icon className="h-6 w-6" style={{color: '#123458'}} />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive 
          ? 'text-white shadow-md' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
      style={{
        backgroundColor: isActive ? '#123458' : 'transparent'
      }}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  const UserRow = ({ user }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium" style={{backgroundColor: '#123458'}}>
            {user.name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{
          backgroundColor: user.role === 'Manager' ? '#D4C9BE' : '#B8C8D9',
          color: '#123458'
        }}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.status === 'Active' ? 'bg-green-100 text-green-800' :
          user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.joinDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
          <Eye className="h-4 w-4" />
        </button>
        <button className="text-green-600 hover:text-green-900 mr-3">
          <Edit className="h-4 w-4" />
        </button>
        <button className="text-red-600 hover:text-red-900">
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );

  const ProjectRow = ({ project }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{project.title}</div>
        <div className="text-sm text-gray-500">by {project.author}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {project.submitted}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          project.priority === 'High' ? 'bg-red-100 text-red-800' :
          project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {project.priority}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-green-600 hover:text-green-900 mr-3">
          <CheckCircle className="h-4 w-4" />
        </button>
        <button className="text-red-600 hover:text-red-900 mr-3">
          <XCircle className="h-4 w-4" />
        </button>
        <button className="text-indigo-600 hover:text-indigo-900">
          <Eye className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );

  const ActivityRow = ({ activity }) => (
    <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg">
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
        activity.type === 'user' ? 'bg-blue-100' :
        activity.type === 'project' ? 'bg-green-100' :
        'bg-gray-100'
      }`}>
        {activity.type === 'user' ? <Users className="h-4 w-4 text-blue-600" /> :
         activity.type === 'project' ? <FileText className="h-4 w-4 text-green-600" /> :
         <Settings className="h-4 w-4 text-gray-600" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
        <p className="text-sm text-gray-500">{activity.user} • {activity.time}</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Users" 
                value={stats.totalUsers.toLocaleString()} 
                icon={Users}
                trend="+12% from last month"
              />
              <StatCard 
                title="Active Projects" 
                value={stats.activeProjects} 
                icon={FileText}
                trend="+8% from last month"
              />
              <StatCard 
                title="Pending Approvals" 
                value={stats.pendingApprovals} 
                icon={Clock}
                trend="-5% from last month"
              />
              <StatCard 
                title="System Health" 
                value={`${stats.systemHealth}%`} 
                icon={Shield}
                trend="Excellent"
              />
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6 space-y-2">
                  {activityLog.map((activity) => (
                    <ActivityRow key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-3">
                  <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Plus className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">Add New User</span>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Download className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">Export Reports</span>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">System Settings</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <p className="text-gray-600">Manage and monitor user accounts</p>
              </div>
              <button 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                style={{backgroundColor: '#123458'}}
              >
                <Plus className="h-5 w-5" />
                <span>Add User</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUsers.map((user) => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Project Approvals</h2>
                <p className="text-gray-600">Review and approve pending projects</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{pendingProjects.length} pending</span>
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingProjects.map((project) => (
                      <ProjectRow key={project.id} project={project} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
              <p className="text-gray-600">Monitor system performance and user engagement</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart placeholder</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Statistics</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f4f7fa'}}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium" style={{backgroundColor: '#123458'}}>
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-6 py-3 bg-gradient-to-r from-[#123458] to-[#1e4a73] text-white rounded-xl hover:from-[#1e4a73] hover:to-[#2a5a8a] font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 border border-[#B8C8D9] border-opacity-30 hover:border-opacity-50"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <TabButton
              id="overview"
              label="Overview"
              icon={BarChart3}
              isActive={activeTab === 'overview'}
              onClick={setActiveTab}
            />
            <TabButton
              id="users"
              label="Users"
              icon={Users}
              isActive={activeTab === 'users'}
              onClick={setActiveTab}
            />
            <TabButton
              id="projects"
              label="Projects"
              icon={FileText}
              isActive={activeTab === 'projects'}
              onClick={setActiveTab}
            />
            <TabButton
              id="analytics"
              label="Analytics"
              icon={Activity}
              isActive={activeTab === 'analytics'}
              onClick={setActiveTab}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
