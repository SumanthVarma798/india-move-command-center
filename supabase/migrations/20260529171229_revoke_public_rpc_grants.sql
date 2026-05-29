revoke execute on function public.get_shared_dashboard(text) from public;
revoke execute on function public.save_shared_dashboard(text, jsonb) from public;

grant execute on function public.get_shared_dashboard(text) to anon;
grant execute on function public.save_shared_dashboard(text, jsonb) to anon;
