import Image from "next/image";
export const Loader=()=>{
    return(
        <div className="h-full flex flex-col gap-y-4 items-center
        justify-center">
            <div className="w-10 h-10 relative animate-spin">
           <Image
             alt="logo"
             layout="fill"
             src="/logo.png"
            //  objectFit="contain"
           />
        </div>
        <p className="text-md text-muted-foreground">
            ProPulse is thinking...
        </p>
        </div>
    );
};