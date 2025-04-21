
import { supabase } from "@/integrations/supabase/client";
import { TeacherSettings } from "@/utils/types";

export const fetchTeacherSettings = async (userId: string): Promise<TeacherSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('teacher_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If no settings found, return null
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data ? {
      id: data.id,
      userId: data.user_id,
      displayName: data.display_name,
      email: data.email,
      department: data.department,
      bio: data.bio,
      profilePicture: data.profile_picture,
      notificationPreferences: data.notification_preferences,
      theme: data.theme,
      language: data.language
    } : null;
  } catch (error) {
    console.error("Error fetching teacher settings:", error);
    throw error;
  }
};

export const updateTeacherSettings = async (userId: string, settings: Partial<TeacherSettings>): Promise<TeacherSettings> => {
  try {
    // Check if settings exist
    const existingSettings = await fetchTeacherSettings(userId);
    
    const updateData: any = {};
    
    if (settings.displayName) updateData.display_name = settings.displayName;
    if (settings.email) updateData.email = settings.email;
    if (settings.department !== undefined) updateData.department = settings.department;
    if (settings.bio !== undefined) updateData.bio = settings.bio;
    if (settings.profilePicture !== undefined) updateData.profile_picture = settings.profilePicture;
    if (settings.notificationPreferences) updateData.notification_preferences = settings.notificationPreferences;
    if (settings.theme) updateData.theme = settings.theme;
    if (settings.language) updateData.language = settings.language;
    
    let result;
    
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('teacher_settings')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new settings
      updateData.user_id = userId;
      
      // Set defaults for required fields if not provided
      if (!updateData.display_name) {
        const { data: userData } = await supabase.auth.getUser();
        updateData.display_name = userData.user?.user_metadata?.name || userData.user?.email?.split('@')[0] || 'Teacher';
      }
      
      if (!updateData.email) {
        const { data: userData } = await supabase.auth.getUser();
        updateData.email = userData.user?.email || '';
      }
      
      if (!updateData.notification_preferences) {
        updateData.notification_preferences = {
          emailNotifications: true,
          assessmentReminders: true,
          studentUpdates: true
        };
      }
      
      if (!updateData.theme) updateData.theme = 'system';
      if (!updateData.language) updateData.language = 'en';
      
      const { data, error } = await supabase
        .from('teacher_settings')
        .insert([updateData])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    return {
      id: result.id,
      userId: result.user_id,
      displayName: result.display_name,
      email: result.email,
      department: result.department,
      bio: result.bio,
      profilePicture: result.profile_picture,
      notificationPreferences: result.notification_preferences,
      theme: result.theme,
      language: result.language
    };
  } catch (error) {
    console.error("Error updating teacher settings:", error);
    throw error;
  }
};

export const fetchStudentDetails = async (studentId: string): Promise<StudentDetails | null> => {
  try {
    // Fetch student data
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();
    
    if (studentError) throw studentError;
    
    if (!studentData) return null;
    
    // Fetch marks data
    const { data: marksData, error: marksError } = await supabase
      .from('marks')
      .select('*, courses(id, name)')
      .eq('student_id', studentId);
    
    if (marksError) throw marksError;
    
    // Fetch student assessments data
    const { data: assessmentsData, error: assessmentsError } = await supabase
      .from('student_assessments')
      .select('*, assessments(id, name, date, total_marks)')
      .eq('student_id', studentId);
    
    if (assessmentsError) throw assessmentsError;
    
    // Prepare marks data
    const marks = marksData.map((mark: any) => ({
      courseId: mark.course_id,
      courseName: mark.courses.name,
      midSemMarks: mark.mid_sem_marks,
      endSemMarks: mark.end_sem_marks,
      internalMarks: mark.internal_marks,
      totalPercentage: calculateTotalPercentage(mark.mid_sem_marks, mark.end_sem_marks, mark.internal_marks)
    }));
    
    // Prepare performance data (this is a simplified version)
    const performance: ModulePerformance[] = marks.map((mark: any) => ({
      moduleId: mark.courseId,
      moduleName: mark.courseName,
      percentage: mark.totalPercentage,
      status: determineStatus(mark.totalPercentage)
    }));
    
    // Prepare assessments data
    const assessments = assessmentsData.map((assessment: any) => {
      const totalScore = assessment.scores.reduce((sum: number, item: any) => sum + item.score, 0);
      return {
        id: assessment.assessment_id,
        name: assessment.assessments.name,
        date: assessment.assessments.date,
        score: totalScore,
        totalMarks: assessment.assessments.total_marks,
        percentage: (totalScore / assessment.assessments.total_marks) * 100
      };
    });
    
    return {
      id: studentData.id,
      name: studentData.name,
      registrationNumber: studentData.registration_no,
      email: studentData.email,
      phone: studentData.phone,
      address: studentData.address,
      marks,
      performance,
      assessments
    };
  } catch (error) {
    console.error("Error fetching student details:", error);
    throw error;
  }
};

// Helper function to calculate total percentage
const calculateTotalPercentage = (midSemMarks?: number, endSemMarks?: number, internalMarks?: number): number => {
  // This is a simplified calculation - adjust as needed
  const total = (midSemMarks || 0) + (endSemMarks || 0) + (internalMarks || 0);
  const maxTotal = 100; // Assuming a max of 100
  return (total / maxTotal) * 100;
};

// Helper function to determine status
const determineStatus = (percentage: number): "strong" | "average" | "weak" => {
  if (percentage >= 75) return "strong";
  if (percentage >= 50) return "average";
  return "weak";
};
