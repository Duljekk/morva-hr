/**
 * Database types generated from Supabase schema
 * These types provide TypeScript autocomplete and type safety for database queries
 */

export type UserRole = 'employee' | 'hr_admin';
export type CheckInStatus = 'ontime' | 'late';
export type CheckOutStatus = 'ontime' | 'overtime' | 'leftearly';
export type DayType = 'full' | 'half';
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type NotificationType = 
  | 'leave_approved' 
  | 'leave_rejected' 
  | 'leave_sent' 
  | 'payslip_ready' 
  | 'announcement' 
  | 'attendance_reminder';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          full_name: string;
          role: UserRole;
          employee_id: string | null;
          shift_start_hour: number;
          shift_end_hour: number;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          full_name: string;
          role?: UserRole;
          employee_id?: string | null;
          shift_start_hour?: number;
          shift_end_hour?: number;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          full_name?: string;
          role?: UserRole;
          employee_id?: string | null;
          shift_start_hour?: number;
          shift_end_hour?: number;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
      };
      leave_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon_name: string | null;
          annual_quota: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon_name?: string | null;
          annual_quota?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon_name?: string | null;
          annual_quota?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          check_in_time: string;
          check_in_status: CheckInStatus;
          check_out_time: string | null;
          check_out_status: CheckOutStatus | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          check_in_time: string;
          check_in_status: CheckInStatus;
          check_out_time?: string | null;
          check_out_status?: CheckOutStatus | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          check_in_time?: string;
          check_in_status?: CheckInStatus;
          check_out_time?: string | null;
          check_out_status?: CheckOutStatus | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leave_requests: {
        Row: {
          id: string;
          user_id: string;
          leave_type_id: string;
          start_date: string;
          end_date: string;
          day_type: DayType;
          total_days: number;
          reason: string | null;
          status: LeaveRequestStatus;
          approved_by: string | null;
          approved_at: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          leave_type_id: string;
          start_date: string;
          end_date: string;
          day_type?: DayType;
          total_days: number;
          reason?: string | null;
          status?: LeaveRequestStatus;
          approved_by?: string | null;
          approved_at?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          leave_type_id?: string;
          start_date?: string;
          end_date?: string;
          day_type?: DayType;
          total_days?: number;
          reason?: string | null;
          status?: LeaveRequestStatus;
          approved_by?: string | null;
          approved_at?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leave_request_attachments: {
        Row: {
          id: string;
          leave_request_id: string;
          file_name: string;
          file_size: number;
          file_url: string;
          file_type: string | null;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          leave_request_id: string;
          file_name: string;
          file_size: number;
          file_url: string;
          file_type?: string | null;
          uploaded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          leave_request_id?: string;
          file_name?: string;
          file_size?: number;
          file_url?: string;
          file_type?: string | null;
          uploaded_by?: string;
          created_at?: string;
        };
      };
      leave_balances: {
        Row: {
          id: string;
          user_id: string;
          leave_type_id: string;
          balance: number;
          allocated: number;
          used: number;
          year: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          leave_type_id: string;
          balance?: number;
          allocated?: number;
          used?: number;
          year: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          leave_type_id?: string;
          balance?: number;
          allocated?: number;
          used?: number;
          year?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          created_by: string;
          scheduled_for: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          created_by: string;
          scheduled_for?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          created_by?: string;
          scheduled_for?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      announcement_reactions: {
        Row: {
          id: string;
          announcement_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          announcement_id: string;
          user_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          announcement_id?: string;
          user_id?: string;
          emoji?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          description: string;
          related_entity_type: string | null;
          related_entity_id: string | null;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          title: string;
          description: string;
          related_entity_type?: string | null;
          related_entity_id?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: NotificationType;
          title?: string;
          description?: string;
          related_entity_type?: string | null;
          related_entity_id?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
      };
      payslips: {
        Row: {
          id: string;
          user_id: string;
          month: number;
          year: number;
          gross_salary: number;
          net_salary: number;
          deductions: Record<string, any> | null;
          allowances: Record<string, any> | null;
          pdf_url: string;
          file_name: string;
          file_size: number | null;
          generated_at: string;
          generated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          month: number;
          year: number;
          gross_salary: number;
          net_salary: number;
          deductions?: Record<string, any> | null;
          allowances?: Record<string, any> | null;
          pdf_url: string;
          file_name: string;
          file_size?: number | null;
          generated_at?: string;
          generated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          month?: number;
          year?: number;
          gross_salary?: number;
          net_salary?: number;
          deductions?: Record<string, any> | null;
          allowances?: Record<string, any> | null;
          pdf_url?: string;
          file_name?: string;
          file_size?: number | null;
          generated_at?: string;
          generated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_email_for_username: {
        Args: { p_username: string | null };
        Returns: string | null;
      };
    };
    Enums: {
      user_role: UserRole;
      check_in_status: CheckInStatus;
      check_out_status: CheckOutStatus;
      day_type: DayType;
      leave_request_status: LeaveRequestStatus;
      notification_type: NotificationType;
    };
  };
}


