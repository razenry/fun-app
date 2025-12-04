import { prisma } from "@/lib/prisma";

export const GET = async () => {
  let interval: ReturnType<typeof setInterval>; // <-- ini penting

  const stream = new ReadableStream({
    start(controller) {
      const send = async () => {
        try {
          const users = await prisma.user.findMany();
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify(users)}\n\n`)
          );
        } catch (err) {
          console.error(err);
        }
      };

      // Kirim data pertama kali
      send();

      // Kirim setiap 1 detik
      interval = setInterval(send, 1000);
    },
    cancel() {
      // Bersihkan interval saat client disconnect
      clearInterval(interval as unknown as number); // pakai cast
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
