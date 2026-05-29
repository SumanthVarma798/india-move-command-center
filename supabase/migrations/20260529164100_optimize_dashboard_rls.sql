drop policy if exists "Users can read their own dashboard state"
  on public.dashboard_states;
drop policy if exists "Users can insert their own dashboard state"
  on public.dashboard_states;
drop policy if exists "Users can update their own dashboard state"
  on public.dashboard_states;
drop policy if exists "Users can delete their own dashboard state"
  on public.dashboard_states;

create policy "Users can read their own dashboard state"
  on public.dashboard_states
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own dashboard state"
  on public.dashboard_states
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own dashboard state"
  on public.dashboard_states
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own dashboard state"
  on public.dashboard_states
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
