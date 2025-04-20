
import { supabase } from "@/integrations/supabase/client";

export interface Mark {
  id: string;
  studentId: string;
  courseId: string;
  midSemMarks?: number;
  endSemMarks?: number;
  internalMarks?: number;
}

export const fetchMarks = async (studentId?: string, courseId?: string): Promise<Mark[]> => {
  try {
    let query = supabase
      .from('marks')
      .select('id, student_id, course_id, mid_sem_marks, end_sem_marks, internal_marks');
    
    if (studentId) {
      query = query.eq('student_id', studentId);
    }
    
    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map(mark => ({
      id: mark.id,
      studentId: mark.student_id,
      courseId: mark.course_id,
      midSemMarks: mark.mid_sem_marks,
      endSemMarks: mark.end_sem_marks,
      internalMarks: mark.internal_marks
    }));
  } catch (error) {
    console.error("Error fetching marks:", error);
    throw error;
  }
};

export const fetchMarkById = async (id: string): Promise<Mark | null> => {
  try {
    const { data, error } = await supabase
      .from('marks')
      .select('id, student_id, course_id, mid_sem_marks, end_sem_marks, internal_marks')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data ? {
      id: data.id,
      studentId: data.student_id,
      courseId: data.course_id,
      midSemMarks: data.mid_sem_marks,
      endSemMarks: data.end_sem_marks,
      internalMarks: data.internal_marks
    } : null;
  } catch (error) {
    console.error("Error fetching mark by ID:", error);
    throw error;
  }
};

export const updateMarks = async (mark: Partial<Mark> & { id: string }): Promise<Mark> => {
  try {
    const updateData: any = {};
    
    if (mark.midSemMarks !== undefined) updateData.mid_sem_marks = mark.midSemMarks;
    if (mark.endSemMarks !== undefined) updateData.end_sem_marks = mark.endSemMarks;
    if (mark.internalMarks !== undefined) updateData.internal_marks = mark.internalMarks;
    
    const { data, error } = await supabase
      .from('marks')
      .update(updateData)
      .eq('id', mark.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      studentId: data.student_id,
      courseId: data.course_id,
      midSemMarks: data.mid_sem_marks,
      endSemMarks: data.end_sem_marks,
      internalMarks: data.internal_marks
    };
  } catch (error) {
    console.error("Error updating marks:", error);
    throw error;
  }
};

export const addMark = async (mark: Omit<Mark, 'id'>): Promise<Mark> => {
  try {
    const { data, error } = await supabase
      .from('marks')
      .insert([{
        student_id: mark.studentId,
        course_id: mark.courseId,
        mid_sem_marks: mark.midSemMarks,
        end_sem_marks: mark.endSemMarks,
        internal_marks: mark.internalMarks
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      studentId: data.student_id,
      courseId: data.course_id,
      midSemMarks: data.mid_sem_marks,
      endSemMarks: data.end_sem_marks,
      internalMarks: data.internal_marks
    };
  } catch (error) {
    console.error("Error adding mark:", error);
    throw error;
  }
};

export const deleteMark = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('marks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting mark:", error);
    throw error;
  }
};
