import { useParams } from "react-router-dom";
import ngoCategories from "@/assets/ngoCategories.json";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileWarning } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import apiUrl from "@/api/apiConfig";

interface Ngo {
  category: string;
  subcategory: string;
  contact_no: string;
  email: string;
  location: string;
  name: string;
  ngoId: string;
}

const CategorySearch = () => {

  const [ngos, setNgos] = useState<Ngo[]>([]);
  const category = useParams();
  const [description, setdescription] = useState("");
  const [dialog, setDialog] = useState(false);
  const [selectedNgo, SetSelectedNgo] = useState({
    name: '',
    subcategory: '',
    location: '',
    contact_no: ''
  })
  useEffect(() => {
    const foundCategory = ngoCategories.find(
      (item) => item.category === category.category
    );
    if (foundCategory) {
      setdescription(foundCategory.description);
    }
  }, [category]);


  const fetchNgos = async () => {
    try {
      const response = await fetch (`${apiUrl}/api/ngo/${category.category}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      if(response.ok){
        setNgos(result);
      }
      else{
        console.error("Error: " + result.message);
      }
    } catch (error) {
        console.error("An error occured, please try again!" + error);
    }
  }

  useEffect(() => {
    fetchNgos();
  }, []);

  const handleView = (name: string, subcategory: string, location: string, contact_no: string) => {
    setDialog(true);
    SetSelectedNgo({
      name: name,
      subcategory: subcategory,
      location: location,
      contact_no: contact_no,
    })
  }


  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen w-full m-0 flex flex-col">
      <Navbar />
      <div className="mt-16 w-full flex flex-col gap-6 justify-center items-center">
        <h1 className="font-bold text-3xl text-center mt-4">{category.category}</h1>
        <p className="max-w-5xl text-justify px-6">{description}</p>
      </div>
      <div className="mt-10 mx-auto">
        <Card className="max-w-5xl">
          <CardHeader>
            <CardTitle className="text-xl text-center">{category.category} NGOs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5vw]">#</TableHead>
                  <TableHead className="w-[20vw]">Name</TableHead>
                  <TableHead className="w-[25vw]">Subcategory</TableHead>
                  <TableHead className="hidden md:table-cell w-[20vw]">
                    Address
                  </TableHead>
                  <TableHead className="hidden md:table-cell w-[15vw]">
                    Contact
                  </TableHead>
                  <TableHead className="md:hidden w-[15vw]">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ngos
                  .filter((ngo) => ngo.category === category.category)
                  .map((ngo, index) => (
                    <TableRow key={ngo.ngoId}>
                      <TableCell className="text-left">{index + 1}</TableCell>
                      <TableCell className="text-left">{ngo.name}</TableCell>
                      <TableCell className="text-left">
                        {ngo.subcategory}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-left">
                        {ngo.location}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-left">
                        {ngo.contact_no}
                      </TableCell>
                      <TableCell className="md:hidden text-left">
                        <Button
                          onClick={() =>
                            handleView(
                              ngo.name,
                              ngo.subcategory,
                              ngo.location,
                              ngo.contact_no
                            )
                          }>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {ngos.filter((ngo) => ngo.category === category.category)
                  .length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="w-full flex flex-col justify-center items-center p-4">
                        <FileWarning size={48} />
                        <p>No items found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Dialog open={dialog} onOpenChange={setDialog}>
          <DialogContent>
            <DialogHeader className="flex flex-col justify-center items-center">
              <DialogTitle>{selectedNgo.name}</DialogTitle>
                <DialogDescription>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold text-left">Subcategory:</TableCell>
                      <TableCell className="text-left">{selectedNgo.subcategory}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold text-left">Location:</TableCell>
                      <TableCell className="text-left">{selectedNgo.location}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold text-left">Contact No:</TableCell>
                      <TableCell className="text-left">{selectedNgo.contact_no}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
};

export default CategorySearch;
