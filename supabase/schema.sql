CREATE TABLE public.users (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on public.users for update
  using ( auth.uid() = id );

CREATE TABLE public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  company text,
  role text,
  location text,
  salary text,
  description text,
  apply_link text,
  created_at timestamptz default now()
);

alter table public.saved_jobs enable row level security;

create policy "Users can view own saved jobs"
  on public.saved_jobs for select
  using ( auth.uid() = user_id );

create policy "Users can insert own saved jobs"
  on public.saved_jobs for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete own saved jobs"
  on public.saved_jobs for delete
  using ( auth.uid() = user_id );

CREATE TABLE public.search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  query text not null,
  created_at timestamptz default now()
);

alter table public.search_history enable row level security;

create policy "Users can view own search history"
  on public.search_history for select
  using ( auth.uid() = user_id );

create policy "Users can insert own search history"
  on public.search_history for insert
  with check ( auth.uid() = user_id );

-- Supabase auth trigger for new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
