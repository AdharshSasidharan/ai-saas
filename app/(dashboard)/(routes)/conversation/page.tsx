"use client";
import * as z from "zod";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Heading } from "@/components/heading";
import { Loader, MessageSquare } from "lucide-react";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

import { useState } from "react";
import { Empty } from "@/components/empty";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";
const ConversationPage = () => {
  const proModal=useProModal();
  const router =useRouter();
  const [messages, setMessages] =useState<ChatCompletionMessageParam []>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      
    const userMessage: ChatCompletionMessageParam  = {
      role: "user",
      content: values.prompt,
    };

    const newMessages={...messages, userMessage};
    const response= await axios.post("/api/conversation",{
      messages: [userMessage],
    });
    setMessages((current: any) =>[...current, userMessage, response.data]);
    form.reset();
    }catch(error: any){
      if(error?.response?.status ===403){
        proModal.onOpen();
      }
      else{
        toast.error("Something went wrong")
      }
    }
    finally{ 
    setIsLoading(false);
    router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
             rounded-lg
             border
             w-full
             p-4
             px-3
             md:px-6
             focus-within:shadow-sm
             grid
             grid-cols-12
             gap-2
             "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none
                          focus-visible:ring-0
                          focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="How do I calculate the radius of a circle?"
                          {...field}
                          
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button className="col-span-12 lg:col-span-2">
                Generate

            </Button>
          </form>
          
          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center
              justify-center bg-muted">
                <Loader/>
                </div>
            )}
            {messages.length === 0 &&  !isLoading &&(
              <Empty label="No conversation started" />
            )}
             
            <div className="fles flex-col-reverse gap-y-4">
               {messages.map((message, index)=>(
                 <div key={index}
                 className={cn( "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role==="user"?"bg-white border border-black/10":"bg-muted"
                 )}> 
                {Array.isArray(message.content) ? (
                   message.content.map((part) => {
                    if (typeof part === 'string') {
                      return <p key={index}>{part}</p>; 
                    }  else {
                     
                    } 
                  })
                 ) : (
                  <p className="text-sm">
                  {message.role==="user" ? <UserAvatar/>:
                   <BotAvatar/>}
                   {message.content}
                   </p>
                 )}
               </div>
             ))}
            </div>
          </div>
        </FormProvider>
      </div>
    </div> 
  );
};

export default ConversationPage;
