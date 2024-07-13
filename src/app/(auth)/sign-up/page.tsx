
"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signUpSchema } from '@/schemas/signUpSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponce } from '@/types/ApiResponce'
import { toast, useToaster } from 'react-hot-toast'
import { useToast } from '@/components/ui/use-toast'
import { useDebounceCallback} from "usehooks-ts"
import { Loader2 } from 'lucide-react'

function page() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);

  const {toast} = useToast()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver : zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })


  useEffect(()=>{
    const checkUsernameUnique = async  () => {
     if (username) {
      setIsCheckingUsername(true)
      setUsernameMessage('')
      try {
        await axios.get(`/api/check-username-unique?username=${username}`)
      } catch (error) {
        
      }
      
     }
    }
  })



  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponce>('/api/sign-up', data);

      toast({
        title: "Success",
        description: response.data.message,

      })

      setIsSubmitting(false)
    } catch (error) {
      console.error("error during signup", error);

      let axiosError = error as AxiosError<ApiResponce>
      let errorMessage = axiosError.response?.data.message ?? "Something went wrong"
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      
    }
  }


  return (
    <>
    <div>
      <div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
  <FormField
    control={form.control}
    name="username"
    render={({field}) => (
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl >
          <Input placeholder="username" {...field}
            onChange={(e) => {
              field.onChange(e)
              debounced(e.target.value)
            }}
          />
          {isCheckingUsername && <Loader2 className='animate-spin'/>}
          {!isCheckingUsername && usernameMessage && (<p
          className={`text-sm ${usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'}`}
          >{usernameMessage}</p>)}
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    control={form.control}
    name="username"
    render={({field}) => (
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl >
          <Input placeholder="username" {...field} />
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    control={form.control}
    name="username"
    render={({field}) => (
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl >
          <Input placeholder="username" {...field} />
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    )}
  />
  </form>
   <Button type="submit">Submit</Button>
</Form>

      </div>
    </div>
    </>
  )
}

export default page