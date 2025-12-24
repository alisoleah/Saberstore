import { useState } from 'react';
import { Users, Settings, CheckCircle, Clock, XCircle } from 'lucide-react';
import { KYCReviewCard } from '../components/admin/KYCReviewCard';
import { InterestRateConfig } from '../components/admin/InterestRateConfig';
import { mockKYCApplications, mockInstallmentPlans, categories } from '../data/mockData';
import type { InstallmentPlanConfig } from '../types';

type TabType = 'kyc' | 'rates';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('kyc');
  const [applications, setApplications] = useState(mockKYCApplications);
  const [plans, setPlans] = useState<InstallmentPlanConfig[]>(mockInstallmentPlans);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const handleApprove = (userId: string, creditLimit: number) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.userId === userId
          ? {
              ...app,
              kycStatus: 'Approved' as const,
              kycApprovedAt: new Date(),
              approvedBy: 'admin-current',
            }
          : app
      )
    );
    console.log(`Approved ${userId} with credit limit: ${creditLimit} EGP`);
  };

  const handleReject = (userId: string, reason: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.userId === userId ? { ...app, kycStatus: 'Rejected' as const } : app
      )
    );
    console.log(`Rejected ${userId} - Reason: ${reason}`);
  };

  const handleUpdatePlan = (planId: string, updates: Partial<InstallmentPlanConfig>) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.id === planId ? { ...plan, ...updates } : plan))
    );
  };

  const handleCreatePlan = (newPlan: Omit<InstallmentPlanConfig, 'id'>) => {
    const id = `plan-${Date.now()}`;
    setPlans((prev) => [...prev, { ...newPlan, id }]);
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.kycStatus.toLowerCase() === filter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.kycStatus === 'Pending').length,
    approved: applications.filter((a) => a.kycStatus === 'Approved').length,
    rejected: applications.filter((a) => a.kycStatus === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {/* Header */}
      <div className="bg-[#003366] text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/80">Manage KYC applications and installment plans</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-[#E0E0E0]">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#003366] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#003366]">{stats.total}</p>
                <p className="text-[#666666] text-sm">Total Applications</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF6600] rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FF6600]">{stats.pending}</p>
                <p className="text-[#666666] text-sm">Pending Review</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00C851] rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#00C851]">{stats.approved}</p>
                <p className="text-[#666666] text-sm">Approved</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF4444] rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FF4444]">{stats.rejected}</p>
                <p className="text-[#666666] text-sm">Rejected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E0E0E0]">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('kyc')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'kyc'
                  ? 'text-[#003366]'
                  : 'text-[#666666] hover:text-[#003366]'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              KYC Applications
              {activeTab === 'kyc' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#003366]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('rates')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'rates'
                  ? 'text-[#003366]'
                  : 'text-[#666666] hover:text-[#003366]'
              }`}
            >
              <Settings className="w-4 h-4 inline-block mr-2" />
              Interest Rates
              {activeTab === 'rates' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#003366]"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'kyc' && (
          <>
            {/* Filter */}
            <div className="mb-6 flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? 'bg-[#003366] text-white'
                      : 'bg-white text-[#666666] hover:bg-[#F0F4F8]'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status === 'pending' && stats.pending > 0 && (
                    <span className="ml-2 bg-[#FF6600] text-white px-2 py-0.5 rounded-full text-xs">
                      {stats.pending}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* KYC Applications Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredApplications.map((app) => (
                <KYCReviewCard
                  key={app.userId}
                  application={app}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>

            {filteredApplications.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-[#666666]">No applications found</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'rates' && (
          <InterestRateConfig
            plans={plans}
            categories={categories.map((c) => c.name)}
            onUpdatePlan={handleUpdatePlan}
            onCreatePlan={handleCreatePlan}
          />
        )}
      </div>
    </div>
  );
}
