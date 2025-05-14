import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, Briefcase, Calendar, MessageSquare,
  TrendingUp, Award, Target, Activity
} from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    jobCount: 0,
    alumniCount: 0,
    eventsCount: 0,
    forumCount: 0
  });
  const [chartData, setChartData] = useState({
    jobsPerMonth: [],
    applicationsPerJob: [],
    mostSoughtJobs: [],
    monthlyApplications: [],
    jobPostingsVsApplications: [],
    applicationsPerJobType: [],
    jobPostingsByRecruiter: [],
    jobApplicationsPerCompany: [],
    sortedJobsbyApplications: []
  });

  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const [
          graduateCountRes,
          newsfeedCountRes,
          jobCountRes,
          jobsPerMonthRes,
          applicationsPerJobRes,
          mostSoughtJobsRes,
          monthlyApplicationsRes,
          jobPostingsVsApplicationsRes,
          applicationsPerJobTypeRes,
          jobPostingsByRecruiterRes,
          jobApplicationsPerCompanyRes,
          sortedJobsbyApplicationsRes,
          jobPositngbyNicheRes,
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates/count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/newsfeeds/count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs/count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/analytics/job-postings-per-month`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/analytics/applications-per-job`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/analytics/most-sought-jobs`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/analytics/applications-per-month`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/analytics/job-postings-vs-applications-over-time`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/analytics/applications-per-job-type`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/analytics/job-postings-by-recruiter`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/analytics/applications-per-company`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/analytics/jobs-by-applications`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/analytics/niches`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setStats({
          jobCount: jobCountRes.data.data.count,
          alumniCount: graduateCountRes.data.data.count, // Placeholder
          eventsCount: newsfeedCountRes.data.data.count,  // Placeholder
          forumCount: 45    // Placeholder
        });

        setChartData({
          jobsPerMonth: jobsPerMonthRes.data.data.map(item => ({
            name: `${item._id.year}-${item._id.month}`,
            totalJobs: item.totalJobs
          })),
          applicationsPerJob: applicationsPerJobRes.data,
          mostSoughtJobs: mostSoughtJobsRes.data,
          monthlyApplications: monthlyApplicationsRes.data,
          jobPostingsVsApplications: jobPostingsVsApplicationsRes.data,
          applicationsPerJobType: applicationsPerJobTypeRes.data,
          jobPostingsByRecruiter: jobPostingsByRecruiterRes.data,
          jobApplicationsPerCompany: jobApplicationsPerCompanyRes.data,
          sortedJobsbyApplications: sortedJobsbyApplicationsRes.data,
          // Check for job niche data and ensure it exists
          jobPositngbyNiche: jobPositngbyNicheRes.data?.data || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.status === 401) {
          navigate('/');
        }
      }
    };

    fetchDashboardData();
  }, [user, navigate]);


  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-4 border-', 'bg-').replace('-500', '-100')}`}>
          <Icon className={`w-6 h-6 ${color.replace('border-l-4 border-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">{title}</h2>
      {children}
    </div>
  );

  if (!user || user.role !== 'admin') return null;

  const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F9C74F'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            title="Posted Jobs"
            value={stats.jobCount}
            color="border-blue-500"
          />
          <StatCard
            icon={Users}
            title="Total Alumni"
            value={stats.alumniCount}
            color="border-green-500"
          />
          <StatCard
            icon={Calendar}
            title="Total Events"
            value={stats.eventsCount}
            color="border-yellow-500"
          />
          <StatCard
            icon={MessageSquare}
            title="Forum Topics"
            value={stats.forumCount}
            color="border-purple-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jobs Trend */}
          <ChartCard title="Jobs Posted Trend" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.jobsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="totalJobs"
                  stroke="#3B82F6"
                  fill="#93C5FD"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Applications per Job Type */}
          <ChartCard title="Applications by Job Type">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.applicationsPerJobType}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="totalApplications"
                  nameKey="jobType"
                  label
                >
                  {chartData.applicationsPerJobType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Most Sought Jobs
          <ChartCard title="Most Sought-After Jobs">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={chartData.mostSoughtJobs.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis
                  type="category"
                  dataKey="title"
                  stroke="#6B7280"
                  tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                />
                <Tooltip />
                <Bar dataKey="applicationCount" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard> */}
                    {/* Job Niche Distribution */}

                    <ChartCard title="Job Niche Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.jobPositngbyNiche || []}  // Ensure data is an array, fallback to empty array
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="totalJobs"
                  nameKey="niche"
                  label
                >
                  {(chartData.jobPositngbyNiche || []).map((entry, index) => (  // Safe map
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Applications Per Company */}
          <ChartCard title="Applications per Company" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.jobApplicationsPerCompany}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="company"
                  stroke="#6B7280"
                  angle={-35}
                  textAnchor="end"
                  height={80}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalApplications" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Most Popular Jobs by Applications */}
          <ChartCard title="Most Popular Jobs by Applications" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.sortedJobsbyApplications}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="title"
                  stroke="#6B7280"
                  angle={-35}
                  textAnchor="end"
                  height={80}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="applicationCount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Monthly Applications vs Job Postings */}
          <ChartCard title="Applications vs Job Postings" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.jobPostingsVsApplications}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalJobs"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalApplications"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Recruiters */}
          <ChartCard title="Top Recruiters by Job Postings" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.jobPostingsByRecruiter.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="recruiterName"
                  stroke="#6B7280"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="totalJobs" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;