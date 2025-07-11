
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceRequestFormData {
  client_name: string;
  client_email: string;
  client_phone: string;
  company: string;
  project_name: string;
  description: string;
  main_features: string;
  problem_statement: string;
  target_users: string;
  daily_tasks: string;
  reports_needed: string;
  devices: string[];
  current_software: string;
  integrations: string;
  urgency: string;
  start_date: string;
  deadline: string;
  budget_range: string;
  inspiration: string;
  files: Array<{ name: string; url: string; type: string }>;
}

export const useServiceRequestForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceRequestFormData>({
    client_name: '',
    client_email: '',
    client_phone: '',
    company: '',
    project_name: '',
    description: '',
    main_features: '',
    problem_statement: '',
    target_users: '',
    daily_tasks: '',
    reports_needed: '',
    devices: [],
    current_software: '',
    integrations: '',
    urgency: '',
    start_date: '',
    deadline: '',
    budget_range: '',
    inspiration: '',
    files: []
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeviceChange = (device: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      devices: checked 
        ? [...prev.devices, device]
        : prev.devices.filter(d => d !== device)
    }));
  };

  const handleFilesChange = (files: Array<{ name: string; url: string; type: string }>) => {
    setFormData(prev => ({ ...prev, files }));
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      client_email: '',
      client_phone: '',
      company: '',
      project_name: '',
      description: '',
      main_features: '',
      problem_statement: '',
      target_users: '',
      daily_tasks: '',
      reports_needed: '',
      devices: [],
      current_software: '',
      integrations: '',
      urgency: '',
      start_date: '',
      deadline: '',
      budget_range: '',
      inspiration: '',
      files: []
    });
  };

  const submitForm = async (): Promise<boolean> => {
    setLoading(true);

    try {
      // Create the insert object with only the required fields and proper null handling
      const insertData: any = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        company: formData.company,
        project_name: formData.project_name,
        description: formData.description,
        main_features: formData.main_features,
        devices: formData.devices,
        files: formData.files,
      };

      // Add optional fields only if they have values
      if (formData.client_phone) insertData.client_phone = formData.client_phone;
      if (formData.problem_statement) insertData.problem_statement = formData.problem_statement;
      if (formData.target_users) insertData.target_users = formData.target_users;
      if (formData.daily_tasks) insertData.daily_tasks = formData.daily_tasks;
      if (formData.reports_needed) insertData.reports_needed = formData.reports_needed;
      if (formData.current_software) insertData.current_software = formData.current_software;
      if (formData.integrations) insertData.integrations = formData.integrations;
      if (formData.urgency) insertData.urgency = formData.urgency;
      if (formData.start_date) insertData.start_date = formData.start_date;
      if (formData.deadline) insertData.deadline = formData.deadline;
      if (formData.budget_range) insertData.budget_range = formData.budget_range;
      if (formData.inspiration) insertData.inspiration = formData.inspiration;

      const { data, error } = await supabase
        .from('service_requests')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Service Request Submitted",
        description: `Request ${data.request_number} has been created successfully!`,
      });

      resetForm();
      return true;
    } catch (error: any) {
      console.error('Service request submission error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleFieldChange,
    handleDeviceChange,
    handleFilesChange,
    submitForm,
    resetForm
  };
};
