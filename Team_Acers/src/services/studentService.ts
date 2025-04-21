
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/utils/types";

export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, email, registration_no, phone, address');
    
    if (error) throw error;
    
    return data.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      registrationNumber: student.registration_no,
      phone: student.phone || '',
      address: student.address || ''
    }));
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const fetchStudentById = async (id: string): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, email, registration_no, phone, address')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data ? {
      id: data.id,
      name: data.name,
      email: data.email,
      registrationNumber: data.registration_no,
      phone: data.phone || '',
      address: data.address || ''
    } : null;
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    throw error;
  }
};

export const addStudent = async (student: Omit<Student, 'id'>): Promise<Student> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert([{
        name: student.name,
        email: student.email,
        registration_no: student.registrationNumber,
        phone: student.phone,
        address: student.address
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      registrationNumber: data.registration_no,
      phone: data.phone || '',
      address: data.address || ''
    };
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
};

export const updateStudent = async (id: string, student: Partial<Student>): Promise<Student> => {
  try {
    const updateData: any = {};
    
    if (student.name) updateData.name = student.name;
    if (student.email) updateData.email = student.email;
    if (student.registrationNumber) updateData.registration_no = student.registrationNumber;
    if (student.phone !== undefined) updateData.phone = student.phone;
    if (student.address !== undefined) updateData.address = student.address;
    
    const { data, error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      registrationNumber: data.registration_no,
      phone: data.phone || '',
      address: data.address || ''
    };
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

export const deleteStudent = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

export const fetchStudentProfile = async (authId: string): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('auth_id', authId)
      .single();
    
    if (error) throw error;
    
    return data ? {
      id: data.id,
      name: data.name,
      email: data.email,
      registrationNumber: data.registration_no,
      phone: data.phone || '',
      address: data.address || ''
    } : null;
  } catch (error) {
    console.error("Error fetching student profile:", error);
    throw error;
  }
};

export const updateStudentProfile = async (authId: string, updates: Partial<Student>): Promise<void> => {
  try {
    const updateData: any = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.email) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.address !== undefined) updateData.address = updates.address;
    
    const { error } = await supabase
      .from('students')
      .update(updateData)
      .eq('auth_id', authId);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating student profile:", error);
    throw error;
  }
};
