import { createClient } from '@supabase/supabase-js'

// Supabase 무료 티어 사용
// 실제 프로젝트에서는 환경변수로 설정해야 함
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Local fallback when Supabase is not configured
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://demo.supabase.co'
}

// Local storage based database for development
export const localDB = {
  // Users table simulation
  async createUser(userData) {
    const users = JSON.parse(localStorage.getItem('voice_coach_users') || '[]')
    const newUser = {
      id: 'user_' + Date.now(),
      ...userData,
      created_at: new Date().toISOString(),
      tokens: 1000,
      credits: 100
    }
    users.push(newUser)
    localStorage.setItem('voice_coach_users', JSON.stringify(users))
    return newUser
  },

  async getUser(id) {
    const users = JSON.parse(localStorage.getItem('voice_coach_users') || '[]')
    return users.find(user => user.id === id)
  },

  // Discussion rooms table simulation
  async createDiscussionRoom(roomData) {
    const rooms = JSON.parse(localStorage.getItem('voice_coach_rooms') || '[]')
    const newRoom = {
      id: 'room_' + Date.now(),
      ...roomData,
      created_at: new Date().toISOString()
    }
    rooms.push(newRoom)
    localStorage.setItem('voice_coach_rooms', JSON.stringify(rooms))
    return newRoom.id
  },

  async getDiscussionRoom(id) {
    const rooms = JSON.parse(localStorage.getItem('voice_coach_rooms') || '[]')
    return rooms.find(room => room.id === id)
  },

  async getUserDiscussionRooms(userId) {
    const rooms = JSON.parse(localStorage.getItem('voice_coach_rooms') || '[]')
    return rooms.filter(room => room.user_id === userId)
  },

  // Conversations table simulation  
  async createConversation(conversationData) {
    const conversations = JSON.parse(localStorage.getItem('voice_coach_conversations') || '[]')
    const newConversation = {
      id: 'conv_' + Date.now(),
      ...conversationData,
      created_at: new Date().toISOString()
    }
    conversations.push(newConversation)
    localStorage.setItem('voice_coach_conversations', JSON.stringify(conversations))
    return newConversation
  },

  async getRoomConversations(roomId) {
    const conversations = JSON.parse(localStorage.getItem('voice_coach_conversations') || '[]')
    return conversations.filter(conv => conv.room_id === roomId)
  },

  // Feedback table simulation
  async createFeedback(feedbackData) {
    const feedbacks = JSON.parse(localStorage.getItem('voice_coach_feedbacks') || '[]')
    const newFeedback = {
      id: 'feedback_' + Date.now(),
      ...feedbackData,
      created_at: new Date().toISOString()
    }
    feedbacks.push(newFeedback)
    localStorage.setItem('voice_coach_feedbacks', JSON.stringify(feedbacks))
    return newFeedback
  }
}

// Database abstraction layer - Replicating all Convex functionality
export const db = {
  // === USERS API (replacing convex/users.js) ===
  
  async createUser(userData) {
    if (isSupabaseConfigured()) {
      try {
        // Check if user already exists (like Convex CreateUser)
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('email', userData.email)
          .maybeSingle();
        
        if (existingUser) {
          console.log('User already exists, returning existing user');
          return existingUser;
        }
        
        // Create new user
        const { data, error } = await supabase
          .from('users')
          .insert([{
            name: userData.name,
            email: userData.email,
            credits: userData.credits || 50000
          }])
          .select()
        
        if (error) {
          console.log('Supabase user creation error, using localStorage:', error.message);
          return await localDB.createUser(userData);
        }
        return data[0]
      } catch (error) {
        console.log('Supabase connection failed, using localStorage:', error.message);
        return await localDB.createUser(userData);
      }
    } else {
      return await localDB.createUser(userData)
    }
  },

  async updateUserCredits(userId, credits) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update({ credits: credits })
          .eq('id', userId)
          .select()
        
        if (error) {
          console.log('Supabase credits update error:', error.message);
          return false;
        }
        return data[0]
      } catch (error) {
        console.log('Supabase connection failed for credits update:', error.message);
        return false;
      }
    } else {
      // Update in localStorage
      const users = JSON.parse(localStorage.getItem('voice_coach_users') || '[]')
      const userIndex = users.findIndex(user => user.id === userId || user._id === userId)
      if (userIndex !== -1) {
        users[userIndex].credits = credits
        localStorage.setItem('voice_coach_users', JSON.stringify(users))
        return users[userIndex]
      }
      return false;
    }
  },

  async getUser(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) {
          console.log('Supabase get user error, using localStorage:', error.message);
          return await localDB.getUser(id);
        }
        return data
      } catch (error) {
        console.log('Supabase connection failed, using localStorage:', error.message);
        return await localDB.getUser(id);
      }
    } else {
      return await localDB.getUser(id)
    }
  },

  async createDiscussionRoom(roomData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('discussion_rooms')
          .insert([roomData])
          .select()
        
        if (error) {
          console.log('Supabase error, using localStorage:', error.message);
          return await localDB.createDiscussionRoom(roomData);
        }
        return data[0].id
      } catch (error) {
        console.log('Supabase connection failed, using localStorage:', error.message);
        return await localDB.createDiscussionRoom(roomData);
      }
    } else {
      return await localDB.createDiscussionRoom(roomData)
    }
  },

  async getDiscussionRoom(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('discussion_rooms')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) {
          console.log('Supabase error, using localStorage:', error.message);
          return await localDB.getDiscussionRoom(id);
        }
        return data
      } catch (error) {
        console.log('Supabase connection failed, using localStorage:', error.message);
        return await localDB.getDiscussionRoom(id);
      }
    } else {
      return await localDB.getDiscussionRoom(id)
    }
  },

  async getUserDiscussionRooms(userId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('discussion_rooms')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.log('Supabase error, using localStorage:', error.message);
          return await localDB.getUserDiscussionRooms(userId);
        }
        return data
      } catch (error) {
        console.log('Supabase connection failed, using localStorage:', error.message);
        return await localDB.getUserDiscussionRooms(userId);
      }
    } else {
      return await localDB.getUserDiscussionRooms(userId)
    }
  },

  async createConversation(conversationData) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('conversations')
        .insert([conversationData])
        .select()
      
      if (error) throw error
      return data[0]
    } else {
      return await localDB.createConversation(conversationData)
    }
  },

  async getRoomConversations(roomId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data
    } else {
      return await localDB.getRoomConversations(roomId)
    }
  },

  // === ADDITIONAL DISCUSSION ROOM FUNCTIONS ===
  
  async updateRoomConversation(roomId, conversation) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('discussion_rooms')
          .update({ conversation: conversation })
          .eq('id', roomId)
          .select()
        
        if (error) {
          console.log('Supabase conversation update error:', error.message);
          return false;
        }
        return data[0]
      } catch (error) {
        console.log('Supabase connection failed for conversation update:', error.message);
        return false;
      }
    } else {
      // Update in localStorage
      const rooms = JSON.parse(localStorage.getItem('voice_coach_rooms') || '[]')
      const roomIndex = rooms.findIndex(room => room.id === roomId)
      if (roomIndex !== -1) {
        rooms[roomIndex].conversation = conversation
        localStorage.setItem('voice_coach_rooms', JSON.stringify(rooms))
        return rooms[roomIndex]
      }
      return false;
    }
  },

  async updateRoomSummary(roomId, summary) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('discussion_rooms')
          .update({ summary: summary })
          .eq('id', roomId)
          .select()
        
        if (error) {
          console.log('Supabase summary update error:', error.message);
          return false;
        }
        return data[0]
      } catch (error) {
        console.log('Supabase connection failed for summary update:', error.message);
        return false;
      }
    } else {
      // Update in localStorage
      const rooms = JSON.parse(localStorage.getItem('voice_coach_rooms') || '[]')
      const roomIndex = rooms.findIndex(room => room.id === roomId)
      if (roomIndex !== -1) {
        rooms[roomIndex].summary = summary
        localStorage.setItem('voice_coach_rooms', JSON.stringify(rooms))
        return rooms[roomIndex]
      }
      return false;
    }
  },

  // === FEEDBACK SYSTEM ===

  async createFeedback(feedbackData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('feedbacks')
          .insert([feedbackData])
          .select()
        
        if (error) {
          console.log('Supabase feedback creation error, using localStorage:', error.message);
          return await localDB.createFeedback(feedbackData);
        }
        return data[0]
      } catch (error) {
        console.log('Supabase connection failed, using localStorage:', error.message);
        return await localDB.createFeedback(feedbackData);
      }
    } else {
      return await localDB.createFeedback(feedbackData)
    }
  }
}