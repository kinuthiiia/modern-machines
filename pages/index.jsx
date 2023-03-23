import { useState } from "react";
import { Button, Input, Text } from "@mantine/core";
import { IconMapPin, IconPlus, IconSearch } from "@tabler/icons";
import { useQuery } from "urql";
import { useRouter } from "next/router";

export default function Home() {
  // States
  const [keyword, setKeyword] = useState(null);
  const router = useRouter();

  // Requests

  const GET_MACHINES = `
      query GET_MACHINES{
        getMachines{
          id
          name
          images
          price
          location
          description
          contacts{
            name
            telephone
          }
          tags
        }
      }

  `;

  const [{ data, fetching, error }] = useQuery({
    query: GET_MACHINES,
  });

  return (
    <div>
      <img src="/logo.png" className="h-[48px]" />
      <div className="p-5 space-y-5">
        <div>
          <Input
            variant="filled"
            placeholder="Search machine"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            rightSection={<IconSearch size={16} color="gray" />}
          />
        </div>
        <div>
          {fetching && <p>Fetching....</p>}
          {error && <p>error ....</p>}
          {data?.getMachines
            .filter((machine) => {
              if (!keyword) return machine;

              if (keyword)
                return (
                  machine?.name.toLowerCase().includes(keyword.toLowerCase()) ||
                  machine?.tags.includes(keyword.toLowerCase())
                );
            })
            .map((machine, i) => (
              <Machine meta={machine} router={router} key={i} />
            ))}
          {data?.getMachines.length < 1 && <p>No machines to display</p>}
        </div>
        <Button onClick={() => router.push("/admin")} color="red" uppercase>
          <IconPlus style={{ marginRight: 12 }} /> new Machine
        </Button>
      </div>
    </div>
  );
}

const Machine = ({ meta, router }) => {
  return (
    <div className="flex space-x-3">
      <img
        src={meta?.images?.length < 0 ? "/favicon.ico" : meta?.images[0]}
        alt="image"
        className="h-[130px] w-[130px] hover:cursor-pointer"
        onClick={() => router.push(`/machine/${meta?.id}`)}
      />

      <div className="w-full">
        <Text c="dimmed">{meta?.name || "[Machine name]"}</Text>
        <Text c="red" fw={700} fz="xl">
          ≈ Ksh.{" "}
          {meta?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ||
            "[Machine price]"}
        </Text>
        <span className="flex space-x-2 items-baseline">
          <IconMapPin size={16} color="orange" />
          <p>{meta?.location || "[Machine location]"}</p>
        </span>
        <Button
          fullWidth
          variant="light"
          color="red"
          radius="md"
          uppercase
          mt={12}
          size="sm"
        >
          Get Quote
        </Button>
      </div>
    </div>
  );
};
