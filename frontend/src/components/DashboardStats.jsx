// src/components/DashboardStats.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  FaProjectDiagram, FaBriefcase, FaFileAlt, FaClipboardCheck, 
  FaUsers, FaChartLine, FaArrowUp, FaArrowDown 
} from "react-icons/fa";
import { 
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const DashboardStats = ({ stats }) => {
  // Create charts based on actual stats data
  const activeProjects = stats.projectsStats?.active || 0;
  const completedProjects = stats.projectsStats?.completed || 0;
  const totalProjects = stats.projectsStats?.total || 0;
  
  const activeInternships = stats.internshipsStats?.active || 0;
  const completedInternships = stats.internshipsStats?.completed || 0;
  const totalInternships = stats.internshipsStats?.total || 0;
  
  const pendingApplications = stats.pendingApplications || 0;
  const approvedApplications = stats.approvedApplications || 0;
  const rejectedApplications = stats.rejectedApplications || 0;
  
  const pendingSubmissions = stats.pendingSubmissions || 0;
  const approvedSubmissions = stats.approvedSubmissions || 0;
  const rejectedSubmissions = stats.rejectedSubmissions || 0;

  // Projects data for line chart (showing progression over time)
  const projectsData = [
    { name: 'Inactive', value: Math.max(0, totalProjects - activeProjects - completedProjects) },
    { name: 'Completed', value: completedProjects },
    { name: 'Active', value: activeProjects }
  ];

  // Internships data for line chart
  const internshipsData = [
    { name: 'Inactive', value: Math.max(0, totalInternships - activeInternships - completedInternships) },
    { name: 'Completed', value: completedInternships },
    { name: 'Active', value: activeInternships }
  ];

  // Applications status progression
  const applicationStatusData = [
    { name: 'Rejected', value: rejectedApplications },
    { name: 'Pending', value: pendingApplications },
    { name: 'Approved', value: approvedApplications }
  ];

  // Submissions status progression
  const submissionsData = [
    { name: 'Rejected', value: rejectedSubmissions },
    { name: 'Pending', value: pendingSubmissions },
    { name: 'Approved', value: approvedSubmissions }
  ];

  // Create real overview data based on actual stats
  const overviewData = [
    {
      category: 'Projects',
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      inactive: Math.max(0, totalProjects - activeProjects - completedProjects),
      completionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
    },
    {
      category: 'Internships',
      total: totalInternships,
      active: activeInternships,
      completed: completedInternships,
      inactive: Math.max(0, totalInternships - activeInternships - completedInternships),
      completionRate: totalInternships > 0 ? Math.round((completedInternships / totalInternships) * 100) : 0
    },
    {
      category: 'Applications',
      total: pendingApplications + approvedApplications + rejectedApplications,
      active: pendingApplications,
      completed: approvedApplications,
      inactive: rejectedApplications,
      completionRate: (pendingApplications + approvedApplications + rejectedApplications) > 0 ? 
        Math.round((approvedApplications / (pendingApplications + approvedApplications + rejectedApplications)) * 100) : 0
    },
    {
      category: 'Submissions',
      total: pendingSubmissions + approvedSubmissions + rejectedSubmissions,
      active: pendingSubmissions,
      completed: approvedSubmissions,
      inactive: rejectedSubmissions,
      completionRate: (pendingSubmissions + approvedSubmissions + rejectedSubmissions) > 0 ? 
        Math.round((approvedSubmissions / (pendingSubmissions + approvedSubmissions + rejectedSubmissions)) * 100) : 0
    }
  ];

  // Status distribution data for pie chart
  const statusDistributionData = [
    { name: 'Active Projects', value: activeProjects, color: '#123458' },
    { name: 'Active Internships', value: activeInternships, color: '#B8C8D9' },
    { name: 'Pending Applications', value: pendingApplications, color: '#D4C9BE' },
    { name: 'Pending Submissions', value: pendingSubmissions, color: '#9ab4cc' }
  ].filter(item => item.value > 0);

  // Performance metrics data
  const performanceData = [
    {
      metric: 'Project Success',
      current: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
      target: 80,
      color: '#123458'
    },
    {
      metric: 'Internship Success',
      current: totalInternships > 0 ? Math.round((completedInternships / totalInternships) * 100) : 0,
      target: 75,
      color: '#B8C8D9'
    },
    {
      metric: 'Application Approval',
      current: (pendingApplications + approvedApplications + rejectedApplications) > 0 ? 
        Math.round((approvedApplications / (pendingApplications + approvedApplications + rejectedApplications)) * 100) : 0,
      target: 70,
      color: '#D4C9BE'
    },
    {
      metric: 'Submission Approval',
      current: (pendingSubmissions + approvedSubmissions + rejectedSubmissions) > 0 ? 
        Math.round((approvedSubmissions / (pendingSubmissions + approvedSubmissions + rejectedSubmissions)) * 100) : 0,
      target: 85,
      color: '#9ab4cc'
    }
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-[#B8C8D9] border-opacity-30">
          <p className="font-semibold text-[#123458] mb-2">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {`${entry.name}: ${entry.value}${entry.name.includes('Rate') ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const statBlocks = [
    {
      title: "Active Projects",
      value: activeProjects,
      icon: FaProjectDiagram,
      gradient: "from-[#123458] to-[#1e4a73]",
      link: "/alumni/projects",
      change: totalProjects > 0 ? `${Math.round((activeProjects / totalProjects) * 100)}%` : "0%",
      changeType: activeProjects > completedProjects ? "increase" : "neutral",
      chartData: projectsData,
      strokeColor: "#D4C9BE"
    },
    {
      title: "Active Internships",
      value: activeInternships,
      icon: FaBriefcase,
      gradient: "from-[#B8C8D9] to-[#9ab4cc]",
      link: "/alumni/internships",
      change: totalInternships > 0 ? `${Math.round((activeInternships / totalInternships) * 100)}%` : "0%",
      changeType: activeInternships > completedInternships ? "increase" : "neutral",
      chartData: internshipsData,
      strokeColor: "#123458"
    },
    {
      title: "Pending Applications",
      value: pendingApplications,
      icon: FaFileAlt,
      gradient: "from-[#D4C9BE] to-[#c9bcb0]",
      link: "/alumni/applications",
      change: applicationStatusData.length > 0 ? `${Math.round((pendingApplications / applicationStatusData.reduce((sum, item) => sum + item.value, 0)) * 100)}%` : "0%",
      changeType: pendingApplications > approvedApplications ? "increase" : "decrease",
      chartData: applicationStatusData,
      strokeColor: "#123458"
    },
    {
      title: "Pending Submissions",
      value: pendingSubmissions,
      icon: FaClipboardCheck,
      gradient: "from-[#123458] via-[#1e4a73] to-[#B8C8D9]",
      link: "/alumni/submissions",
      change: submissionsData.length > 0 ? `${Math.round((pendingSubmissions / submissionsData.reduce((sum, item) => sum + item.value, 0)) * 100)}%` : "0%",
      changeType: pendingSubmissions > approvedSubmissions ? "increase" : "decrease",
      chartData: submissionsData,
      strokeColor: "#D4C9BE"
    },
  ];

  const renderLineChart = (block) => {
    if (!block.chartData || block.chartData.length === 0) return null;
    
    return (
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={block.chartData}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={block.strokeColor}
            strokeWidth={3}
            dot={{ fill: block.strokeColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: block.strokeColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f7fa] via-[#fafbfc] to-[#f4f7fa] p-4">
      <div className="space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statBlocks.map((block, index) => {
            const IconComponent = block.icon;
            return (
              <Link
                key={index}
                to={block.link}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-br ${block.gradient} p-6 text-white relative`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full transform translate-x-8 -translate-y-8 bg-white"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full transform -translate-x-4 translate-y-4 bg-white"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl border border-white border-opacity-20">
                        <IconComponent className="text-2xl" />
                      </div>
                      <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full bg-white bg-opacity-20 backdrop-blur-sm ${
                        block.changeType === 'increase' ? 'text-green-100' : 'text-red-100'
                      }`}>
                        {block.changeType === 'increase' ? 
                          <FaArrowUp className="mr-1 text-xs" /> : 
                          <FaArrowDown className="mr-1 text-xs" />
                        }
                        {block.change}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-3xl font-bold mb-1">{block.value}</div>
                      <div className="text-sm opacity-90 font-medium">{block.title}</div>
                    </div>
                    
                    {/* Mini Line Chart */}
                    <div className="h-15 mt-4">
                      {renderLineChart(block)}
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Activity Overview - Using Real Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Overview Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B8C8D9] border-opacity-20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#123458]">Activity Overview</h3>
                <p className="text-sm text-gray-500">Current status across all categories</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE] rounded-xl">
                <FaChartLine className="text-[#123458] text-xl" />
              </div>
            </div>
            
            {overviewData.some(item => item.total > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overviewData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="category"
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#123458', fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#123458', fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="active" stackId="a" fill="#123458" name="Active" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="completed" stackId="a" fill="#B8C8D9" name="Completed" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="inactive" stackId="a" fill="#D4C9BE" name="Inactive/Rejected" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <FaChartLine className="text-4xl mx-auto mb-2 opacity-50 text-[#B8C8D9]" />
                  <p className="text-[#123458]">No activity data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Status Distribution Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B8C8D9] border-opacity-20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#123458]">Active Items Distribution</h3>
                <p className="text-sm text-gray-500">Current active/pending items breakdown</p>
              </div>
            </div>
            
            {statusDistributionData.length > 0 ? (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <FaChartLine className="text-4xl mx-auto mb-2 opacity-50 text-[#B8C8D9]" />
                  <p className="text-[#123458]">No active items to display</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B8C8D9] border-opacity-20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#123458]">Success Rates</h3>
              <p className="text-sm text-gray-500">Performance metrics vs targets</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceData.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={metric.color}
                      strokeWidth="2"
                      strokeDasharray={`${metric.current}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold" style={{ color: metric.color }}>
                      {metric.current}%
                    </span>
                  </div>
                </div>
                <h4 className="font-semibold text-[#123458] mb-1">{metric.metric}</h4>
                <p className="text-sm text-gray-500">Target: {metric.target}%</p>
                <div className={`text-xs mt-1 ${metric.current >= metric.target ? 'text-green-600' : 'text-orange-600'}`}>
                  {metric.current >= metric.target ? '✓ Target Met' : `${metric.target - metric.current}% to target`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mentorship Requests */}
        {stats.mentorshipRequests > 0 && (
          <div className="bg-gradient-to-r from-[#B8C8D9] via-[#D4C9BE] to-[#B8C8D9] border-2 border-[#123458] border-opacity-20 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-[#123458] bg-opacity-10 text-[#123458] p-4 rounded-xl mr-4 backdrop-blur-sm">
                  <FaUsers className="text-xl" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#123458]">
                    You have {stats.mentorshipRequests} new mentorship request(s)
                  </p>
                  <p className="text-sm text-gray-600">
                    Respond to students seeking guidance
                  </p>
                </div>
              </div>
              <Link
                to="/alumni/mentorship"
                className="px-6 py-3 bg-gradient-to-r from-[#123458] to-[#1e4a73] text-white rounded-xl hover:from-[#1e4a73] hover:to-[#123458] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                View Requests
              </Link>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {stats.recentActivities && stats.recentActivities.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B8C8D9] border-opacity-20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[#123458]">Recent Activity</h3>
              <div className="w-2 h-2 bg-gradient-to-r from-[#123458] to-[#D4C9BE] rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {stats.recentActivities.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-start p-4 bg-gradient-to-r from-[#f4f7fa] to-[#B8C8D9] bg-opacity-20 rounded-xl hover:from-[#B8C8D9] hover:to-[#D4C9BE] hover:bg-opacity-30 transition-all duration-200 border border-[#B8C8D9] border-opacity-20">
                  <div className="w-3 h-3 mt-2 bg-gradient-to-r from-[#123458] to-[#D4C9BE] rounded-full mr-4 flex-shrink-0 shadow-sm"></div>
                  <div className="flex-1">
                    <span className="text-[#123458] font-medium">{activity.message}</span>
                    <div className="text-sm text-gray-500 mt-1 font-medium">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;