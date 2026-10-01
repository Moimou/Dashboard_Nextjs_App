import postgres from "postgres";

// Connexion à Supabase avec les mêmes options que le seed
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
  prepare: false, // Requis pour éviter l'erreur ECONNRESET avec le pooler Supabase
});

async function listLatestInvoices() {
  // Syntaxe adaptée pour la bibliothèque 'postgres' (Supabase)
  const data = await sql`
    SELECT invoices.amount, customers.name, customers.email, customers.image_url
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    ORDER BY invoices.date DESC
    LIMIT 5;
  `;
  return data;
}

export async function GET() {
  try {
    const invoicesData = await listLatestInvoices();
    return Response.json(invoicesData);
  } catch (error: any) {
    return Response.json(
      {
        error: error.message || error,
        detail: "Erreur lors de la récupération des factures sur Supabase",
      },
      { status: 500 },
    );
  }
}
