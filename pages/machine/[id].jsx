import { Button, Divider, Space, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useQuery } from "urql";
import { Carousel } from "@mantine/carousel";
import { IconMapPin } from "@tabler/icons";

export default function Machine() {
  const router = useRouter();

  const { id } = router.query;

  const GET_MACHINE = `
    query GET_MACHINE(
        $id: ID!
    ){
        getMachine(id: $id){
            id
            name
            images
            description
            location
            contacts{
                name
                telephone
            }
            tags
            price                        
        }
    }
  `;
  console.log(id);

  const [{ data, fetching, error }] = useQuery({
    query: GET_MACHINE,
    variables: {
      id,
    },
  });

  console.log(data);

  if (!data?.getMachine) return <p>Loading..</p>;

  if (error) return <p>Error..</p>;

  const { name, price, tags, images, location, description, contacts } =
    data?.getMachine;

  return (
    <div className="overflow-y-auto pb-[100px]">
      <Button
        onClick={() => router.back()}
        color="red"
        variant="outline"
        w={48}
        h={48}
        p={0}
        style={{ position: "fixed", zIndex: 99, top: 10, left: 10 }}
      >
        <p className="text-[1.5rem]">&larr;</p>
      </Button>
      <Carousel maw="100%" loop mx="auto" withIndicators>
        {images.map((image, i) => (
          <Carousel.Slide key={i}>
            <img src={image} className="w-[100%]" alt="machine" />
          </Carousel.Slide>
        ))}
      </Carousel>

      <div className="p-6 ">
        <p className="font-semibold text-[1.1rem]">{name}</p>
        <h1 className="text-[1.4rem] font-bold text-red-500 tracking-tight">
          ≈ Ksh. {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </h1>
        <Space h={10} />
        <span className="flex space-x-2 items-baseline">
          <IconMapPin size={16} color="orange" />
          <p>{location || "[Machine location]"}</p>
        </span>
        <Space h={20} />
        <Divider label="Description" />
        <Space h={20} />
        <Text c="dimmed">{description}</Text>
        <Space h={20} />
        <Divider label="Past Jobs" />
        <Space h={20} />
        {/* Past jobs here */}
        <Space h={20} />
        <Divider label="Contacts" />
        <Space h={20} />
        {contacts.map((contact, i) => (
          <span key={i}>
            <Text fw={700}>{contact?.name}</Text>
            <Text fw={300} c="orange">
              {contact?.telephone}
            </Text>
          </span>
        ))}
        <Button
          style={{ position: "fixed", bottom: 12 }}
          uppercase
          w={"90%"}
          color="red"
          size="lg"
        >
          GET QUOTE
        </Button>
      </div>
    </div>
  );
}
