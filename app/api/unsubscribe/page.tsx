export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email;

  if (!email) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Email не указан в ссылке.</p>
      </div>
    );
  }

  try {
    const res = await fetch(
      `${process.env.API_URL}/subscribers/delete-by-email/${encodeURIComponent(
        email
      )}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to unsubscribe");
    }

    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Вы успешно отписались от рассылки.</p>
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Произошла ошибка при отписке. Попробуйте позже.</p>
      </div>
    );
  }
}
