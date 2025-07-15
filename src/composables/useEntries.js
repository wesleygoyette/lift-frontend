import { ref } from 'vue'
import { API_ENDPOINTS } from '@/config/api'
import { useAuth } from '@/composables/useAuth'

export function useEntries() {
    const { makeAuthenticatedRequest } = useAuth()
    const entries = ref([])
    const isLoading = ref(false)

    const createEntry = async (content) => {
        if (!content || !content.trim()) {
            throw new Error('Entry content is required')
        }

        isLoading.value = true

        try {
            const response = await makeAuthenticatedRequest(API_ENDPOINTS.entries, {
                method: 'POST',
                body: JSON.stringify({
                    entry: {
                        content: content.trim()
                    }
                })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                return data.entry
            } else {
                throw new Error(data.errors ? data.errors.join(', ') : 'Failed to create entry')
            }
        } catch (error) {
            console.error('Error creating entry:', error)
            throw new Error(error.message || 'Network error occurred. Please try again.')
        } finally {
            isLoading.value = false
        }
    }

    const fetchEntries = async () => {
        isLoading.value = true

        try {
            const response = await makeAuthenticatedRequest(API_ENDPOINTS.entries)
            const data = await response.json()

            if (response.ok && data.success) {
                entries.value = data.entries
                return data.entries
            } else {
                throw new Error(data.error || 'Failed to fetch entries')
            }
        } catch (error) {
            console.error('Error fetching entries:', error)
            throw new Error(error.message || 'Network error occurred. Please try again.')
        } finally {
            isLoading.value = false
        }
    }

    const updateEntry = async (id, content) => {
        if (!content || !content.trim()) {
            throw new Error('Entry content is required')
        }

        isLoading.value = true

        try {
            const response = await makeAuthenticatedRequest(`${API_ENDPOINTS.entries}/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    entry: {
                        content: content.trim()
                    }
                })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                // Update local entries array
                const index = entries.value.findIndex(entry => entry.id === id)
                if (index !== -1) {
                    entries.value[index] = data.entry
                }
                return data.entry
            } else {
                throw new Error(data.errors ? data.errors.join(', ') : 'Failed to update entry')
            }
        } catch (error) {
            console.error('Error updating entry:', error)
            throw new Error(error.message || 'Network error occurred. Please try again.')
        } finally {
            isLoading.value = false
        }
    }

    const deleteEntry = async (id) => {
        isLoading.value = true

        try {
            const response = await makeAuthenticatedRequest(`${API_ENDPOINTS.entries}/${id}`, {
                method: 'DELETE'
            })

            const data = await response.json()

            if (response.ok && data.success) {
                // Remove from local entries array
                entries.value = entries.value.filter(entry => entry.id !== id)
                return true
            } else {
                throw new Error(data.error || 'Failed to delete entry')
            }
        } catch (error) {
            console.error('Error deleting entry:', error)
            throw new Error(error.message || 'Network error occurred. Please try again.')
        } finally {
            isLoading.value = false
        }
    }

    return {
        entries,
        isLoading,
        createEntry,
        fetchEntries,
        updateEntry,
        deleteEntry
    }
}
