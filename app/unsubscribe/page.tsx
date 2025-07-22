"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const unsubscribe = async () => {
      if (!email) {
        setStatus("noemail");
        return;
      }

      try {
        const res = await fetch(
          `/api/unsubscribe?email=${encodeURIComponent(email)}`,
          {
            method: "DELETE",
          }
        );

        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    unsubscribe();
  }, [email]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {status === "processing" && <p>Обрабатываем вашу отписку...</p>}
      {status === "success" && <p>Вы успешно отписались от рассылки.</p>}
      {status === "error" && (
        <p>Произошла ошибка при отписке. Попробуйте позже.</p>
      )}
      {status === "noemail" && <p>Email не указан в ссылке.</p>}
    </div>
  );
}
