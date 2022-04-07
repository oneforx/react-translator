
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateCatDto } from './create-cat.dto';

@Controller('cats')
export class CatsController {
    @Post()
    create(@Body() createCatDto: CreateCatDto )  {
      return 'This action adds a new cat';
    }
  
    @Get()
    async findAll(): Promise<any[]> {
      return [];
    }

    @Get()
    findAllObservable(): Observable<any[]> {
      return of([]);
    }
    
    @Get(':id')
    findOne(@Param('id') id: string): string {
        return `This action returns a #${id} cat`;
    }

}
