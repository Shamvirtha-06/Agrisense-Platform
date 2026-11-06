import React, { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { AgentWorkflowStep } from '../types';
import { 
  X, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Activity, 
  FileText, 
  CloudSun, 
  Sprout, 
  ClipboardCheck 
} from 'lucide-react';

interface AgentWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowSteps: AgentWorkflowStep[];
}

export const AgentWorkflowModal: React.FC<AgentWorkflowModalProps> = ({
  isOpen,
  onClose,
  workflowSteps,
}) => {
  const { t, language } = useTranslation();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = workflowSteps[activeStepIndex] || workflowSteps[0];

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'weather':
        return <CloudSun className="w-5 h-5 text-blue-500" />;
      case 'crop':
        return <Sprout className="w-5 h-5 text-emerald-500" />;
      case 'planner':
        return <ClipboardCheck className="w-5 h-5 text-amber-500" />;
      default:
        return <Cpu className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 print:hidden animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {t('agentWorkflowTitle')}
              </h2>
              <p className="text-xs text-slate-400 max-w-xl mt-0.5">
                {t('agentWorkflowSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Step Pipeline Navigator */}
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="flex items-center justify-between gap-2 max-w-3xl mx-auto overflow-x-auto pb-1">
            {workflowSteps.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <React.Fragment key={step.stepNumber}>
                  <button
                    onClick={() => setActiveStepIndex(idx)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex-shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/20'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-white text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      0{step.stepNumber}
                    </span>
                    <span>{language === 'ta' ? step.agentNameTa : step.agentNameEn}</span>
                  </button>

                  {idx < workflowSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 hidden sm:block" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Active Step Deep-Dive Inspector Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Agent Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white shadow-sm border border-emerald-200">
                {getAgentIcon(currentStep.agentId)}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                  Agent Node 0{currentStep.stepNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'ta' ? currentStep.agentNameTa : currentStep.agentNameEn}
                </h3>
              </div>
            </div>
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full self-start sm:self-auto border border-emerald-200">
              {language === 'ta' ? currentStep.agentRoleTa : currentStep.agentRoleEn}
            </div>
          </div>

          {/* 1. Ingested Inputs Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <Layers className="w-4 h-4 text-blue-500" />
              {t('agentInputs')}
            </div>
            <p className="text-xs text-slate-700 font-mono bg-slate-50 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
              {language === 'ta' ? currentStep.inputDescriptionTa : currentStep.inputDescriptionEn}
            </p>
          </div>

          {/* 2. Reasoning Trajectory Pipeline */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              {t('agentReasoning')}
            </div>
            <div className="space-y-2">
              {(language === 'ta' ? currentStep.reasoningChainTa : currentStep.reasoningChainEn).map((trace, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-800 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="leading-snug font-medium">{trace}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Synthesized Outputs */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <FileText className="w-4 h-4" />
              {t('agentOutputs')}
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {language === 'ta' ? currentStep.outputSummaryTa : currentStep.outputSummaryEn}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Step {activeStepIndex + 1} of {workflowSteps.length}
          </div>
          <div className="flex items-center gap-2">
            {activeStepIndex > 0 && (
              <button
                onClick={() => setActiveStepIndex(prev => prev - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
              >
                Previous Step
              </button>
            )}
            {activeStepIndex < workflowSteps.length - 1 ? (
              <button
                onClick={() => setActiveStepIndex(prev => prev + 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5"
              >
                <span>Next Agent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
              >
                {t('closeWorkflow')}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
