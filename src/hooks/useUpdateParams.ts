import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function useUpdateParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const reloadParams = (params: { [key: string]: any }) => {
    const searchParamsInner = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        searchParamsInner.delete(key);
      } else searchParamsInner.set(key, value);
    });

    router.push(`${pathname}?${searchParamsInner.toString()}`);
  };

  return { reloadParams };
}
