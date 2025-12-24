import { useState } from 'react';
import { Percent, Calendar, Tag, Save } from 'lucide-react';
import type { InstallmentPlanConfig } from '../../types';

interface InterestRateConfigProps {
  plans: InstallmentPlanConfig[];
  categories: string[];
  onUpdatePlan: (planId: string, updates: Partial<InstallmentPlanConfig>) => void;
  onCreatePlan: (plan: Omit<InstallmentPlanConfig, 'id'>) => void;
}

export function InterestRateConfig({
  plans,
  categories,
  onUpdatePlan,
  onCreatePlan,
}: InterestRateConfigProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);

  const [newPlan, setNewPlan] = useState({
    name: '',
    durationMonths: 12,
    interestRate: 0,
    minDownPayment: 10,
    isActive: true,
    applicableCategories: [] as string[],
  });

  const handleSavePlan = (planId: string) => {
    // In real implementation, would save to backend
    setEditingId(null);
  };

  const handleCreatePlan = () => {
    onCreatePlan(newPlan);
    setNewPlan({
      name: '',
      durationMonths: 12,
      interestRate: 0,
      minDownPayment: 10,
      isActive: true,
      applicableCategories: [],
    });
    setShowNewPlanForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="bg-[#003366] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
        <h2 className="text-white">Interest Rate Configuration</h2>
        <button
          onClick={() => setShowNewPlanForm(!showNewPlanForm)}
          className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showNewPlanForm ? 'Cancel' : '+ New Plan'}
        </button>
      </div>

      <div className="p-6">
        {/* New Plan Form */}
        {showNewPlanForm && (
          <div className="mb-6 bg-[#F0F4F8] rounded-lg p-4 border-2 border-[#003366]">
            <h3 className="text-[#003366] font-medium mb-4">Create New Installment Plan</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-[#1A1A1A] mb-2">Plan Name</label>
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg outline-none focus:border-[#003366]"
                  placeholder="e.g., Ramadan Special - 12 Months"
                />
              </div>
              <div>
                <label className="block text-[#1A1A1A] mb-2">Duration (Months)</label>
                <select
                  value={newPlan.durationMonths}
                  onChange={(e) => setNewPlan({ ...newPlan, durationMonths: Number(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg outline-none focus:border-[#003366]"
                >
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                  <option value={18}>18 Months</option>
                  <option value={24}>24 Months</option>
                </select>
              </div>
              <div>
                <label className="block text-[#1A1A1A] mb-2">Interest Rate (%)</label>
                <input
                  type="number"
                  value={newPlan.interestRate}
                  onChange={(e) => setNewPlan({ ...newPlan, interestRate: Number(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg outline-none focus:border-[#003366]"
                  min="0"
                  max="30"
                  step="0.5"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[#1A1A1A] mb-2">Min Down Payment (%)</label>
                <input
                  type="number"
                  value={newPlan.minDownPayment}
                  onChange={(e) => setNewPlan({ ...newPlan, minDownPayment: Number(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg outline-none focus:border-[#003366]"
                  min="0"
                  max="50"
                  step="5"
                />
              </div>
            </div>
            <button
              onClick={handleCreatePlan}
              disabled={!newPlan.name}
              className="w-full bg-[#00C851] hover:bg-[#00C851]/90 disabled:bg-[#CCCCCC] text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Create Plan
            </button>
          </div>
        )}

        {/* Existing Plans */}
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border-2 border-[#F0F4F8] rounded-lg p-4 hover:border-[#003366] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-[#003366] font-medium mb-1">{plan.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-[#666666]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {plan.durationMonths} months
                    </div>
                    <div className="flex items-center gap-1">
                      <Percent className="w-4 h-4" />
                      {plan.interestRate}% interest
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {plan.minDownPayment}% down payment
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plan.isActive}
                      onChange={(e) => onUpdatePlan(plan.id, { isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#CCCCCC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00C851]"></div>
                  </label>
                  <span className="text-sm text-[#666666]">
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Applicable Categories */}
              {plan.applicableCategories && plan.applicableCategories.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#F0F4F8]">
                  <p className="text-[#666666] text-xs mb-2">Applicable to:</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.applicableCategories.map((category) => (
                      <span
                        key={category}
                        className="bg-[#FFF4E6] text-[#FF6600] px-2 py-1 rounded text-xs"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Promotional Period */}
              {plan.promotionalUntil && (
                <div className="mt-3 bg-gradient-to-r from-[#FFF4E6] to-[#FFE8CC] border border-[#FF6600]/30 rounded-lg p-2">
                  <p className="text-[#FF6600] text-xs">
                    Promotional until: {new Date(plan.promotionalUntil).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Category-specific Interest Rates */}
        <div className="mt-6 pt-6 border-t border-[#F0F4F8]">
          <h3 className="text-[#003366] font-medium mb-4">Category-Specific Rates</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
              const categoryPlans = plans.filter(
                (p) => p.applicableCategories?.includes(category)
              );
              return (
                <div
                  key={category}
                  className="bg-[#F0F4F8] rounded-lg p-3"
                >
                  <p className="text-[#003366] font-medium mb-1">{category}</p>
                  <p className="text-[#666666] text-sm">
                    {categoryPlans.length > 0
                      ? `${categoryPlans.length} special plan(s)`
                      : 'All plans available'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
