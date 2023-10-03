-- CreateTable
CREATE TABLE "StockPrice" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "highestPriceOfTheDay" DOUBLE PRECISION NOT NULL,
    "lowestPriceOfTheDay" DOUBLE PRECISION NOT NULL,
    "company" TEXT NOT NULL,

    CONSTRAINT "StockPrice_pkey" PRIMARY KEY ("id")
);
