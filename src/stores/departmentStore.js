import { defineStore } from 'pinia'
import client from '../api/client'

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    isLoading: false,
    errors: {}
  }),
  actions: {
    async createDepartment(payload) {
      this.isLoading = true
      this.errors = {}
      try {
        const response = await client.post('/api/v1/departments', payload)
        return { success: true, data: response.data }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // Validation errors from backend
          this.errors = error.response.data.errors || {}
        } else if (error.response && error.response.status === 409) {
          this.errors = { code: 'El código de departamento ya existe' }
        }
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    }
  }
})
