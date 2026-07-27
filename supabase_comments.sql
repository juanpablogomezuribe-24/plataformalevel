-- Ejecuta esto en el Editor SQL de tu Supabase Dashboard

-- 1. Crear tabla de comentarios
CREATE TABLE document_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    content TEXT NOT NULL,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Habilitar seguridad
ALTER TABLE document_comments ENABLE ROW LEVEL SECURITY;

-- 3. Crear política para que usuarios autenticados puedan leer y escribir
CREATE POLICY "Enable all for authenticated users" 
ON document_comments 
FOR ALL USING (auth.role() = 'authenticated');
