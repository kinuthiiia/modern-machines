import { Text, Input, MultiSelect, Textarea, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconPlus, IconX } from "@tabler/icons";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useMutation } from "urql";

export default function Admin() {
  // States and configs
  const [machine, setMachine] = useState({
    name: null,
    price: null,
    description: null,
    contactName: null,
    contactTelephone: null,
    tags: [],
    location: null,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fileInput = useRef();

  //   Requests
  const NEW_MACHINE = `
    mutation NEW_MACHINE(
        $name: String!
        $images: [String]
        $price: Int
        $location: String
        $description: String
        $contactName: String
        $contactTelephone: String
        $tags: [String]
    ){
        newMachine(
            name: $name
            images: $images
            price: $price
            location: $location
            description: $description
            contactName: $contactName
            contactTelephone: $contactTelephone
            tags: $tags
        ){
            name
            id
            price
            location
        }
    }
`;

  const [_, _newMachine] = useMutation(NEW_MACHINE);

  //   Functions

  const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const removeId = (el) => {
    setImages((images) => images.filter((img, i) => i !== el));
  };

  const handleImageSelect = (e) => {
    setImages((images) => [...images, URL.createObjectURL(e.target.files[0])]);
  };

  const handleNewMachine = async () => {
    const {
      name,
      price,
      tags,
      location,
      contactName,
      contactTelephone,
      description,
    } = machine;

    setLoading(true);

    if (!name) {
      notifications.show({
        title: "Missing machine name",
        color: "orange",
        description: "Machine name required",
      });
      setLoading(false);
      return;
    }

    let imagesB64 = [];

    for (const image of images) {
      let imageB64 = await getBase64FromUrl(image);
      imagesB64.push(imageB64);
    }

    _newMachine({
      name,
      price: parseInt(price),
      tags,
      location,
      contactName,
      contactTelephone,
      description,
      images: imagesB64,
    })
      .then(({ data, error }) => {
        if (data?.newMachine) {
          notifications.show({
            title: "Success!",
            message: "New machine added",
            color: "green",
          });
        } else if (error) {
          notifications.show({
            title: "Error",
            message: "Failed to add new machine",
            color: "red",
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-6 space-y-5">
      <Button color="red" onClick={() => router.back()} uppercase>
        <IconArrowLeft style={{ marginRight: 12 }} /> back
      </Button>
      <p className="text-[1.5rem] ">Add machine</p>
      <hr />
      <p>Upload images</p>
      <div className="space-y-6">
        <div className="w-full grid grid-cols-4 gap-6">
          {images.map((image, i) => (
            <div
              key={i}
              className={i == 0 ? `col-span-2 relative` : `col-span-1 relative`}
            >
              <img src={image} />
              <Button
                style={{ position: "absolute", top: 0, right: 0 }}
                w={24}
                h={24}
                p={0}
                color="red"
                onClick={() => removeId(i)}
              >
                <IconX size={12} />
              </Button>
            </div>
          ))}
          <input
            type="file"
            ref={fileInput}
            className="hidden"
            onChange={handleImageSelect}
          />
          <Button
            color="red"
            w={48}
            h={48}
            p={0}
            onClick={() => fileInput.current.click()}
          >
            <IconPlus />
          </Button>
        </div>
        <Input
          variant="filled"
          placeholder="Name of machine"
          value={machine?.name}
          onChange={(e) => {
            setMachine({
              ...machine,
              name: e.target.value,
            });
          }}
        />

        <span className="flex w-full justify-between space-x-6">
          <p className="items-baseline">KSH.</p>
          <input
            type="number"
            placeholder="Price of machine"
            value={machine?.price}
            onChange={(e) => {
              setMachine({
                ...machine,
                price: e.target.value,
              });
            }}
            className="w-full bg-[#f1f1f1] p-2"
          />
        </span>

        <Input
          variant="filled"
          placeholder="Contact Name"
          value={machine?.contactName}
          onChange={(e) => {
            setMachine({
              ...machine,
              contactName: e.target.value,
            });
          }}
        />
        <input
          type="number"
          placeholder="Contact Telephone"
          value={machine?.contactTelephone}
          onChange={(e) => {
            setMachine({
              ...machine,
              contactTelephone: e.target.value,
            });
          }}
          className="w-full bg-[#f1f1f1] p-2"
        />
        <Input
          variant="filled"
          placeholder="Location of machine"
          value={machine?.location}
          onChange={(e) => {
            setMachine({
              ...machine,
              location: e.target.value,
            });
          }}
        />
        <MultiSelect
          variant="filled"
          data={machine.tags}
          placeholder="Machine tags ex. mill"
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            setMachine({
              ...machine,
              tags: [...machine.tags, query],
            });
            return query;
          }}
        />
        <Textarea
          placeholder="Machine description"
          value={machine.description}
          variant="filled"
          onChange={(e) =>
            setMachine({
              ...machine,
              description: e.target.value,
            })
          }
        />
      </div>

      <Button
        color="red"
        uppercase
        loading={loading}
        fullWidth
        variant="light"
        onClick={handleNewMachine}
      >
        Add machine
      </Button>
    </div>
  );
}
