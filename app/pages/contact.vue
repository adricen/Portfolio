<script setup lang="ts">
useHead({
  title: 'Contact | Adrien Centonze',
  meta: [
    { name: 'description', content: 'Contactez-moi pour discuter de vos projets 3D et développement web.' }
  ]
})

const form = ref({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const isSuccess = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  
  // Simulation de l'envoi du formulaire
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  isSubmitting.value = false
  isSuccess.value = true
  form.value = { name: '', email: '', message: '' }
  
  // Afficher une notification
  useToast().add({
    title: 'Message envoyé',
    description: 'Merci pour votre message. Je vous répondrai bientôt.',
    color: 'success'
  })
}
</script>

<template>
  <div class="space-y-8">
    
    <!-- Informations de contact -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-mail" class="w-6 h-6 text-primary-500" />
          <h2 class="text-xl font-bold">Mes coordonnées</h2>
        </div>
      </template>
      
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-mail" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span class="text-gray-700 dark:text-gray-300">contact@adriencentonze.com</span>
        </div>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-device-code" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <a href="https://github.com/acentonze" target="_blank" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-gray-700 dark:text-gray-300">
            github.com/acentonze
          </a>
        </div>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <a href="https://linkedin.com/in/acentonze" target="_blank" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-gray-700 dark:text-gray-300">
            linkedin.com/in/acentonze
          </a>
        </div>
      </div>
    </UCard>
    
    <!-- Formulaire de contact -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-paper-airplane" class="w-6 h-6 text-primary-500" />
          <h2 class="text-xl font-bold">Envoyez-moi un message</h2>
        </div>
      </template>
      
      <UAlert 
        v-if="isSuccess" 
        title="Message envoyé !" 
        description="Merci pour votre message. Je vous répondrai dans les plus brefs délais." 
        icon="i-heroicons-check-circle"
        color="success"
        variant="subtle"
        class="mb-6"
      />
      
      <UForm class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField label="Nom" required>
          <UInput 
            v-model="form.name" 
            placeholder="Votre nom complet" 
            required
          />
        </UFormField>
        
        <UFormField label="Email" required>
          <UInput 
            v-model="form.email" 
            type="email" 
            placeholder="votre@email.com" 
            required
          />
        </UFormField>
        
        <UFormField label="Message" required>
          <UTextarea 
            v-model="form.message" 
            placeholder="Décrivez votre projet ou votre demande..." 
            rows="5" 
            required
          />
        </UFormField>
        
        <UButton 
          type="submit" 
          color="primary" 
          variant="solid" 
          :loading="isSubmitting"
          class="w-full"
        >
          Envoyer le message
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
