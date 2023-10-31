-- CreateTable
CREATE TABLE "Engine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "licenseLink" TEXT NOT NULL,
    "isOpenSource" BOOLEAN NOT NULL,
    "contextLength" INTEGER NOT NULL,
    "parametersSize" TEXT NOT NULL,
    "promptFormat" TEXT NOT NULL,
    "stopTokens" TEXT NOT NULL,
    "includeParameters" TEXT NOT NULL,
    CONSTRAINT "Engine_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "link" TEXT NOT NULL
);
